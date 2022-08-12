import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import type { StateProps } from "../store/index";
import {
  notifiClientSetup,
  notifiServiceSetup,
} from "../modules/NotifiClientSetup";
import store from "../store/index";
import { useWallet } from "solana-wallets-vue";

export let adapter: MessageSignerWalletAdapter;

export type handleSubmitProps = {
  loading: boolean;
  emailInput: string | null;
  telegramInput: string | null;
};

let emailInput = "";
let telegramInput = "";
let announcementsSubscribed = false;
let telegramConfirmationUrl = "";
let loading = false;

const TOPIC_NAME = "notifish__creatorUpdates"; // Talk to us for the right value
const ALERT_NAME = "Vue Sample Alert";

const dappAddress = store.state.dappAddress;
const clientState = store.state.clientState;
const clientData = store.state.clientData;
const notifiService = notifiServiceSetup(store.state.notifiEnvironment);

const { publicKey } = useWallet();

const notifiClient = notifiClientSetup({
  publicKey,
  dappAddress,
  notifiService,
  clientState,
  clientData,
});

const ensureAlertDeleted = async () => {
  if (notifiClient) {
    const data = await notifiClient.fetchData();
    const alertId =
      data.alerts.find((alert) => alert.name === ALERT_NAME)?.id ?? null;
    if (alertId === null) {
      return;
    }

    await notifiClient.deleteAlert({ alertId });
  }
};

const ensureAlertExists = async () => {
  if (notifiClient) {
    const data = await notifiClient.fetchData();
    const announcementAlert = data.alerts.find(
      (alert) => alert.name === ALERT_NAME
    );
    if (announcementAlert !== undefined && announcementAlert.id !== null) {
      console.log("Updating alert", announcementAlert.id);
      return notifiClient.updateAlert({
        alertId: announcementAlert.id,
        emailAddress: emailInput === "" ? null : emailInput,
        phoneNumber: null, // TODO
        telegramId: telegramInput === "" ? null : telegramInput,
      });
    } else {
      // Make sure the Broadcast source exists
      console.log("Creating alert");
      const existingSource = data.sources.find(
        (s) => s.blockchainAddress === TOPIC_NAME
      );
      const source =
        existingSource !== undefined
          ? existingSource
          : await notifiClient.createSource({
              name: TOPIC_NAME,
              blockchainAddress: TOPIC_NAME,
              type: "BROADCAST",
            });

      if (source.id === null) {
        throw new Error("Invalid source");
      }

      const filterId =
        source.applicableFilters.find(
          (f) => f.filterType === "BROADCAST_MESSAGES"
        )?.id ?? null;
      if (filterId === null) {
        throw new Error("Unable to locate applicable filter");
      }

      return notifiClient.createAlert({
        name: ALERT_NAME,
        sourceId: source.id,
        filterId,
        emailAddress: emailInput === "" ? null : emailInput,
        phoneNumber: null, // TODO
        telegramId: telegramInput === "" ? null : telegramInput,
      });
    }
  }
};

export const handleLogin = async (adapter: MessageSignerWalletAdapter) => {
  if (!store.state.clientState.token) {
    await notifiClient?.logOut()
  } else await notifiClient?.logIn(adapter);
}

export const handleSubmit = ({
  loading,
  emailInput,
  telegramInput,
}: handleSubmitProps) => {
  try {
    loading = true;
    if (
      announcementsSubscribed &&
      (emailInput !== "" || telegramInput !== "")
    ) {
      ensureAlertExists()
        .then((a) => {
          console.log("Alert created", a);
        })
        .catch((e) => alert(e));
    } else {
      ensureAlertDeleted()
        .then(() => {
          console.log("Alert deleted");
        })
        .catch((e) => alert(e));
    }
  } finally {
    loading = false;
  }
};

export const unsubscribe = (clientData: StateProps["clientData"]) => {
  if (clientData === null || loading) {
    return;
  }

  const alert = clientData.alerts?.find((a) => a.name === ALERT_NAME);
  if (alert === undefined) {
    announcementsSubscribed = false;
    emailInput = "";
    telegramInput = "";
    telegramConfirmationUrl = "";
  } else {
    announcementsSubscribed = true;
    emailInput = alert.targetGroup.emailTargets[0]?.emailAddress ?? "";

    const telegramTarget = alert.targetGroup.telegramTargets[0];
    telegramInput = telegramTarget?.telegramId ?? "";
    if (telegramTarget !== undefined) {
      telegramConfirmationUrl =
        clientData.telegramTargets.find((t) => t.id === telegramTarget.id)
          ?.confirmationUrl ?? "";
    } else {
      telegramConfirmationUrl = "";
    }
  }
};
