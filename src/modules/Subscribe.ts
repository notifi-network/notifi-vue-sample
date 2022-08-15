import type { NewNotifiClient } from "../modules/NotifiClient";
import { notifiClientSetup, notifiServiceSetup } from "./NotifiClientSetup";
import type { NotifiEnvironment } from "@notifi-network/notifi-axios-utils";
import store from "../store/index";
import type { StateProps } from "../store/index";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import { useWallet } from "solana-wallets-vue";

export const adapter: MessageSignerWalletAdapter | undefined =
  store.state.walletStore;

export type handleSubmitProps = {
  loading: boolean;
  checkSubscribed: boolean;
  emailAddress: string | null;
  telegramId: string | null;
};

type targetSubmitProps = {
  emailAddress: string | null;
  telegramId: string | null;
};

const TOPIC_NAME = "notifish__creatorUpdates"; // Talk to us for the right value
const ALERT_NAME = "Vue Sample Alert";

let dappAddress;
let notifiEnvironment;
const clientState = store.getters.clientState;
const clientData = store.state.clientData;

const { publicKey } = useWallet();

let notifiClient: NewNotifiClient | null;

export const ensureAlertDeleted = async () => {
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

export const ensureAlertExists = async ({
  emailAddress,
  telegramId,
}: targetSubmitProps) => {
  if (notifiClient) {
    const data = await notifiClient.fetchData();
    const announcementAlert = data.alerts.find(
      (alert) => alert.name === ALERT_NAME
    );
    if (announcementAlert !== undefined && announcementAlert.id !== null) {
      console.log("Updating alert", announcementAlert.id);
      return notifiClient.updateAlert({
        alertId: announcementAlert.id,
        emailAddress: emailAddress === "" ? null : emailAddress,
        phoneNumber: null, // TODO
        telegramId: telegramId === "" ? null : telegramId,
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
        emailAddress: emailAddress === "" ? null : emailAddress,
        phoneNumber: null, // TODO
        telegramId: telegramId === "" ? null : telegramId,
      });
    }
  }
};

async function setUpClient(dappAddress: string, notifiEnvironment: NotifiEnvironment) {
  const notifiService = await notifiServiceSetup(notifiEnvironment);

  notifiClient = await notifiClientSetup({
    publicKey,
    dappAddress,
    notifiService,
    clientState,
    clientData,
  });

  return notifiClient
}

export const handleLogin = async (adapter: MessageSignerWalletAdapter) => {
  dappAddress = store.getters.getDappAddress();
  notifiEnvironment = store.getters.getNotifiEnvironment();
  if (store.state.clientState.token) {
    await notifiClient?.logOut();
  } else {
    await setUpClient(dappAddress, notifiEnvironment);
    await notifiClient?.logIn(adapter);
  }
};

export const handleSubmit = async ({
  loading,
  checkSubscribed,
  emailAddress,
  telegramId,
}: handleSubmitProps) => {
  try {
    loading = true;
    if (notifiClient) {
      if (checkSubscribed && (emailAddress !== "" || telegramId !== "")) {
        ensureAlertExists({ emailAddress, telegramId })
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
    }
  } finally {
    loading = false;
  }
};

type UnsubscribeProps = {
  clientData: StateProps["clientData"];
  checkSubscribed: boolean;
  emailAddress: string;
  telegramId: string;
  telegramConfirmationUrl: string;
};

export const unsubscribe = ({
  clientData,
  checkSubscribed,
  emailAddress,
  telegramId,
  telegramConfirmationUrl,
}: UnsubscribeProps) => {
  if (clientData === null) {
    return;
  }

  const alert = clientData.alerts?.find((a) => a.name === ALERT_NAME);
  if (alert === undefined) {
    checkSubscribed = false;
    emailAddress = "";
    telegramId = "";
    telegramConfirmationUrl = "";
  } else {
    checkSubscribed = true;
    emailAddress = alert.targetGroup.emailTargets[0]?.emailAddress ?? "";
    const telegramTarget = alert.targetGroup.telegramTargets[0];
    telegramId = telegramTarget?.telegramId ?? "";
    if (telegramTarget !== undefined) {
      telegramConfirmationUrl =
        clientData.telegramTargets.find((t) => t.id === telegramTarget.id)
          ?.confirmationUrl ?? "";
    } else {
      telegramConfirmationUrl = "";
    }
  }
};
