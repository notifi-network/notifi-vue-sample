import type {
  BroadcastMessageInput,
  ClientBroadcastMessageInput,
  ClientCreateAlertInput,
  ClientCreateBonfidaAuctionSourceInput,
  ClientCreateMetaplexAuctionSourceInput,
  ClientDeleteAlertInput,
  ClientEnsureTargetGroupInput,
  ClientSendVerificationEmailInput,
  ClientUpdateAlertInput,
  CompleteLoginViaTransactionInput,
  CreateSourceInput,
  EmailTarget,
  Filter,
  FilterOptions,
  NotifiClient,
  NotifiService,
  SmsTarget,
  Source,
  SourceGroup,
  TargetGroup,
  TelegramTarget,
  User,
} from "@notifi-network/notifi-core";
import type { MessageSignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import type { PublicKey } from "@solana/web3.js";
import store from "@/store";
import type { StateProps } from "../store/index";
import type { Ref } from "vue";

export class NewNotifiClient implements NotifiClient {
  dappAddress: string;
  publicKey: Ref<PublicKey | null>;
  walletAddress: string | undefined;
  service: NotifiService;
  stateContainer: StateProps["clientState"];
  dataContainer: StateProps["clientData"];

  constructor(
    dappAddress: string,
    publicKey: Ref<PublicKey | null>,
    service: any,
    stateContainer: StateProps["clientState"],
    dataContainer: StateProps["clientData"]
  ) {
    this.dappAddress = dappAddress;
    this.publicKey = publicKey;
    this.walletAddress = publicKey.value?.toBase58();
    this.service = service;
    this.stateContainer = stateContainer;
    this.dataContainer = dataContainer;
  }

  beginLoginViaTransaction = async () => {
    const result = await this.service.beginLogInByTransaction({
      walletAddress: this.walletAddress !== undefined ? this.walletAddress : '',
      walletBlockchain: "SOLANA",
      dappAddress: this.dappAddress,
    });

    const nonce = result?.nonce ?? undefined;
    if (nonce === undefined) {
      throw new Error("Failed to begin login process");
    }

    const ruuid = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(`${nonce}${ruuid}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    store.commit('updateClient', {
      ...this.stateContainer,
      clientRandomUuid: ruuid,
    });

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const logValue = `Notifi Auth: 0x${hashHex}`;

    return { logValue };
  };

  broadcastMessage = async (
    input: ClientBroadcastMessageInput,
    signer: MessageSignerWalletAdapterProps
  ) => {
    const {
      topic,
      subject,
      message,
      isHolderOnly,
      variables: extraVariables,
    } = input;

    if (topic.topicName === null) {
      throw new Error("Invalid UserTopic");
    }

    let targetTemplates: BroadcastMessageInput["targetTemplates"];
    if (topic.targetTemplate !== null) {
      const value = topic.targetTemplate;
      targetTemplates = [
        {
          key: "EMAIL",
          value,
        },
        {
          key: "SMS",
          value,
        },
        {
          key: "TELEGRAM",
          value,
        },
      ];
    }

    const variables = [
      {
        key: "message",
        value: message,
      },
      {
        key: "subject",
        value: subject,
      },
    ];

    if (isHolderOnly && topic.targetCollections !== null) {
      variables.push({
        key: "TargetCollection",
        value: JSON.stringify(topic.targetCollections),
      });
    }

    if (extraVariables !== undefined) {
      Object.keys(extraVariables).forEach((key) => {
        if (
          key !== "message" &&
          key !== "subject" &&
          key !== "TargetCollection"
        ) {
          variables.push({
            key,
            value: extraVariables[key],
          });
        }
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = await this._signMessage({ timestamp, signer });
    const result = await this.service.broadcastMessage({
      topicName: topic.topicName,
      targetTemplates,
      timestamp,
      variables,
      walletBlockchain: "OFF_CHAIN",
      signature,
    });

    return result.id ?? null;
  };

  completeLoginViaTransaction = async (
    input: CompleteLoginViaTransactionInput
  ) => {
    const ruuid = store.getters.clientState.clientRandomUuid;
    if (ruuid === null) {
      throw new Error("Must call beginLoginViaTransaction first");
    }

    const { transactionSignature } = input;
    const result = await this.service.completeLogInByTransaction({
      walletAddress: this.walletAddress !== undefined ? this.walletAddress : '',
      walletBlockchain: "SOLANA",
      dappAddress: this.dappAddress,
      randomUuid: ruuid,
      transactionSignature,
    });

    store.commit("updateClient", {
      ...this.stateContainer,
      clientRandomUuid: null,
    });

    await this._handleLogInResult(result);

    return result;
  };

  fetchData = async () => {
    const results = await this._fetchInternalData();
    return results;
  };

  logIn = async (signer: MessageSignerWalletAdapterProps) => {
    if (signer === null || signer === undefined) {
      throw new Error("Signer cannot be null");
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = await this._signMessage({
      timestamp,
      signer,
    });

    const result = await this.service.logInFromDapp({
      walletPublicKey: this.walletAddress !== undefined ? this.walletAddress : '',
      dappAddress: this.dappAddress,
      timestamp,
      signature,
    });

    await this._handleLogInResult(result);

    return result;
  };

  logOut = async () => {
    this.service.setJwt(null);
    store.commit("updateClientData", null);

    store.commit("updateClient", {
      ...this.stateContainer,
      token: null,
      roles: [],
    });
  };

  createAlert = async (input: ClientCreateAlertInput) => {
    const alerts = await this.service.getAlerts();

    const existingAlert = alerts.find((alert) => alert.name === input.name);
    if (existingAlert !== undefined) {
      throw new Error("Cannot create alerts with duplicate names");
    }

    const [sourceGroup, targetGroup] = await Promise.all([
      this._ensureSourceGroup({
        name: input.name,
        sourceIds: [input.sourceId],
      }),
      this.ensureTargetGroup({
        name: input.name,
        emailAddress: input.emailAddress,
        phoneNumber: input.phoneNumber,
        telegramId: input.telegramId,
      }),
    ]);

    if (sourceGroup.id === null) {
      throw new Error("Unknown error creating SourceGroup");
    }

    if (targetGroup.id === null) {
      throw new Error("Unknown error creating TargetGroup");
    }

    const filterOptions = packFilterOptions(input.filterOptions);

    const newAlert = await this.service.createAlert({
      name: input.name,
      sourceGroupId: sourceGroup.id,
      filterId: input.filterId,
      filterOptions,
      targetGroupId: targetGroup.id,
      groupName: input.groupName ?? "default",
    });

    store.commit("updateClientData", {
      ...this.dataContainer,
      alerts: [...alerts, newAlert],
    });

    return newAlert;
  };

  _ensureSourceGroup = async ({
    name,
    sourceIds,
  }: Readonly<{
    name: string;
    sourceIds: ReadonlyArray<string>;
  }>): Promise<SourceGroup> => {
    const sourceGroups = await this.service.getSourceGroups();
    const existing = sourceGroups.find(
      (sourceGroup) => sourceGroup.name === name
    );
    if (existing === undefined || existing.id === null) {
      const newSourceGroup = await this.service.createSourceGroup({
        name,
        sourceIds,
      });

      store.commit("updateClientData", {
        ...this.dataContainer,
        sourceGroups: [...sourceGroups, newSourceGroup],
      });

      return newSourceGroup;
    } else if (
      !areArraysSetEqual(
        sourceIds,
        existing.sources.map((source) => source.id)
      )
    ) {
      const updatedSourceGroup = await this.service.updateSourceGroup({
        id: existing.id,
        name,
        sourceIds,
      });

      store.commit("updateClientData", {
		...this.dataContainer,
		sourceGroups: [
            ...sourceGroups.slice(0, sourceGroups.indexOf(existing)),
            updatedSourceGroup,
            ...sourceGroups.slice(sourceGroups.indexOf(existing) + 1),
        ],
	  });

      return updatedSourceGroup;
    } else {
    store.commit("updateClientData", {
			...this.dataContainer,
			sourceGroups: sourceGroups,
		  });

      return existing;
    }
  };

  createSource = async (input: CreateSourceInput) => {
    return this._ensureSource(input);
  };

  createMetaplexAuctionSource = async (
    input: ClientCreateMetaplexAuctionSourceInput
  ) => {
    const { auctionAddressBase58, auctionWebUrl } = input;
    const underlyingAddress = `${auctionWebUrl}:;:${auctionAddressBase58}`;
    return this._ensureSource({
      name: input.auctionAddressBase58,
      blockchainAddress: underlyingAddress,
      type: "SOLANA_METAPLEX_AUCTION",
    });
  };

  createBonfidaAuctionSource = async (
    input: ClientCreateBonfidaAuctionSourceInput
  ) => {
    const { auctionAddressBase58, auctionName } = input;
    const underlyingAddress = `${auctionName}:;:${auctionAddressBase58}`;
    return this._ensureSource({
      name: auctionAddressBase58,
      blockchainAddress: underlyingAddress,
      type: "SOLANA_BONFIDA_AUCTION",
    });
  };

  _ensureSource = async (input: CreateSourceInput): Promise<Source> => {
    const sources = await this.service.getSources();
    const { name, blockchainAddress, type } = input;
    const existing = sources.find((source) => source.name === name);
    if (existing !== undefined) {
      if (
        blockchainAddress !== existing.blockchainAddress ||
        type !== existing.type
      ) {
        throw new Error("Cannot create a source with a duplicate name");
      }
      return existing;
    } else {
      const newSource = await this.service.createSource({
        name,
        blockchainAddress,
        type,
      });

	  store.commit("updateClientData", {
		...this.dataContainer,
		sources: [...sources, newSource],
	  });

      return newSource;
    }
  };

  deleteAlert = async (input: ClientDeleteAlertInput) => {
    const alerts = await this.service.getAlerts();
    const existing = alerts.find((alert) => alert.id === input.alertId);
    if (existing === undefined) {
      throw new Error(`Unknown alert id: ${input.alertId}`);
    }

    const result = await this.service.deleteAlert({ id: input.alertId });

    const sourceGroupId = existing.sourceGroup.id;
    let sourceGroups = store.getters.clientData.sourceGroups ?? [];
    if (input.keepSourceGroup !== true && sourceGroupId !== null) {
      await this.service.deleteSourceGroup({ id: sourceGroupId });
      sourceGroups = await this.service.getSourceGroups();
    }

    const targetGroupId = existing.targetGroup.id;
    let targetGroups = store.getters.clientData.targetGroups ?? [];
    if (input.keepTargetGroup !== true && targetGroupId !== null) {
      await this.service.deleteTargetGroup({ id: targetGroupId });
      targetGroups = await this.service.getTargetGroups();
    }

	store.commit("updateClientData", {
		...this.dataContainer,
		alerts: alerts.filter((it) => it !== existing),
        sourceGroups: sourceGroups,
        targetGroups: targetGroups,
	  });

    return result.id;
  };

  getConfiguration = async () => {
    return this.service.getConfigurationForDapp({
      dappAddress: this.dappAddress,
    });
  };

  getTopics = async () => {
    const roles : StateProps["clientState"]["roles"] = store.getters.clientState.roles;
    if (!roles.some((role) => role === "UserMessenger")) {
      throw new Error("This user is not authorized for getTopics!");
    }

    return this.service.getTopics();
  };

  updateAlert = async (input: ClientUpdateAlertInput) => {
    const alerts = await this.service.getAlerts();
    const existingAlert = alerts.find((alert) => alert.id === input.alertId);
    if (
      existingAlert === undefined ||
      existingAlert.targetGroup.name === null
    ) {
      throw new Error(`Unknown alert id: ${input.alertId}`);
    }

    const targetGroup = await this.ensureTargetGroup({
      name: existingAlert.targetGroup.name,
      emailAddress: input.emailAddress,
      phoneNumber: input.phoneNumber,
      telegramId: input.telegramId,
    });

    if (targetGroup.id !== existingAlert.targetGroup.id) {
      throw new Error("Unable to modify TargetGroup");
    }

	store.commit("updateClientData", {
		...this.dataContainer,
		alerts: [
			...alerts.slice(0, alerts.indexOf(existingAlert)),
			{ ...existingAlert, targetGroup },
			...alerts.slice(alerts.indexOf(existingAlert) + 1),
		  ],
	  });

    return existingAlert;
  };

  ensureTargetGroup = async (input: ClientEnsureTargetGroupInput) => {
    const { name, emailAddress, phoneNumber, telegramId } = input;

    const emailTargetId =
      emailAddress !== null
        ? (await this._ensureEmailTarget(emailAddress)).id
        : null;
    const smsTargetId =
      phoneNumber !== null
        ? (await this._ensureSmsTarget(phoneNumber)).id
        : null;
    const telegramTargetId =
      telegramId !== null
        ? (await this._ensureTelegramTarget(telegramId)).id
        : null;

    const emailTargetIds = emailTargetId !== null ? [emailTargetId] : [];
    const smsTargetIds = smsTargetId !== null ? [smsTargetId] : [];
    const telegramTargetIds =
      telegramTargetId !== null ? [telegramTargetId] : [];

    const targetGroups = await this.service.getTargetGroups();
    const existing = targetGroups.find(
      (targetGroup) => targetGroup.name === name
    );
    if (existing === undefined || existing.id === null) {
      const newTargetGroup = await this.service.createTargetGroup({
        name,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
      });

	  store.commit("updateClientData", {
		...this.dataContainer,
		targetGroups: [...targetGroups, newTargetGroup],
	  });

      return newTargetGroup;
    } else if (
      !areArraysSetEqual(
        existing.emailTargets.map((target) => target.id),
        emailTargetIds
      ) ||
      !areArraysSetEqual(
        existing.smsTargets.map((target) => target.id),
        smsTargetIds
      ) ||
      !areArraysSetEqual(
        existing.telegramTargets.map((target) => target.id),
        telegramTargetIds
      )
    ) {
      const updatedTargetGroup = await this.service.updateTargetGroup({
        id: existing.id,
        name: name,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
      });
      const idx = targetGroups.indexOf(existing);

	  store.commit("updateClientData", {
		...this.dataContainer,
		targetGroups: [
            ...targetGroups.slice(0, idx),
            updatedTargetGroup,
            ...targetGroups.slice(idx + 1),
          ],
	  });

      return updatedTargetGroup;
    } else {
      return existing;
    }
  };

  _ensureEmailTarget = async (emailAddress: string): Promise<EmailTarget> => {
    const emailTargets = await this.service.getEmailTargets();
    const existing = emailTargets.find(
      (target) =>
        target.emailAddress?.toLowerCase() === emailAddress.toLowerCase()
    );
    if (existing !== undefined) {
		store.commit("updateClientData", {
			...this.dataContainer,
			emailTargets: emailTargets,
		  });

      return existing;
    } else {
      const newTarget = await this.service.createEmailTarget({
        name: emailAddress,
        value: emailAddress,
      });
      store.commit("updateClientData", {
		...this.dataContainer,
		emailTargets: [...emailTargets, newTarget],
	  });
      return newTarget;
    }
  };

  _ensureSmsTarget = async (phoneNumber: string): Promise<SmsTarget> => {
    const smsTargets = await this.service.getSmsTargets();
    const existing = smsTargets.find(
      (target) => target.phoneNumber === phoneNumber
    );
    if (existing !== undefined) {
		store.commit("updateClientData", {
			...this.dataContainer,
			smsTargets: smsTargets
		  });
      return existing;
    } else {
      const newTarget = await this.service.createSmsTarget({
        name: phoneNumber,
        value: phoneNumber,
      });
	  store.commit("updateClientData", {
		...this.dataContainer,
		smsTargets: [...smsTargets, newTarget],
	  });

      return newTarget;
    }
  };

  _ensureTelegramTarget = async (
    telegramId: string
  ): Promise<TelegramTarget> => {
    const telegramTargets = await this.service.getTelegramTargets();
    const existing = telegramTargets.find(
      (target) => target.telegramId?.toLowerCase() === telegramId.toLowerCase()
    );
    if (existing !== undefined) {

		store.commit("updateClientData", {
			...this.dataContainer,
			telegramTargets: telegramTargets,
		  });

      return existing;
    } else {
      const newTarget = await this.service.createTelegramTarget({
        name: telegramId,
        value: telegramId,
      });

	  store.commit("updateClientData", {
		...this.dataContainer,
		telegramTargets: [...telegramTargets, newTarget],
	  });

      return newTarget;
    }
  };

  sendEmailTargetVerification = async (
    input: ClientSendVerificationEmailInput
  ) => {
    const { targetId } = input;
    const result = await this.service.sendEmailTargetVerificationRequest({
      targetId,
    });

    const sentId = result?.id ?? null;
    if (sentId === null) {
      throw new Error("Problem requesting email verification");
    }

    return sentId;
  };

  _handleLogInResult = async (user: User) => {
    const token = user.authorization?.token ?? null;

    store.commit("updateClient", {
      ...this.stateContainer,
      token: token,
      roles: user?.roles ?? [],
    });

    this.service.setJwt(token);

    const newData = await this._fetchInternalData();
    store.commit("updateClientData", {
		newData
	  });
  };

  _signMessage = async (
    params: Readonly<{
      timestamp: number;
      signer: MessageSignerWalletAdapterProps;
    }>
  ): Promise<string> => {
    const { timestamp, signer } = params;
    const messageBuffer = new TextEncoder().encode(
      `${SIGNING_MESSAGE} \n 'Nonce:' ${this.walletAddress}${
        this.dappAddress
      }${timestamp.toString()}`
    );

    const signedBuffer = await signer.signMessage(messageBuffer);
    const signature = Buffer.from(signedBuffer).toString("base64");
    return signature;
  };

  _fetchInternalData = async (): Promise<StateProps["clientData"]> => {
    const [
      alerts,
      sources,
      sourceGroups,
      targetGroups,
      emailTargets,
      smsTargets,
      telegramTargets,
    ] = await Promise.all([
      this.service.getAlerts(),
      this.service.getSources(),
      this.service.getSourceGroups(),
      this.service.getTargetGroups(),
      this.service.getEmailTargets(),
      this.service.getSmsTargets(),
      this.service.getTelegramTargets(),
    ]);

    const filterIds = new Set<string | null>();
    const filters: Filter[] = [];
    sources
      .flatMap((source) => source?.applicableFilters ?? [])
      .forEach((filter) => {
        if (!filterIds.has(filter.id)) {
          filters.push(filter);
          filterIds.add(filter.id);
        }
      });

    return {
      alerts,
      filters,
      sources,
      sourceGroups,
      targetGroups,
      emailTargets,
      smsTargets,
      telegramTargets,
    };
  };
}

const areArraysSetEqual = <T>(
  left: ReadonlyArray<T>,
  right: ReadonlyArray<T>
): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === rightSet.size &&
    Object.values(leftSet).every((t: T) => rightSet.has(t))
  );
};

const packFilterOptions = (
  clientOptions: Readonly<FilterOptions> | undefined
): string => {
  const record: Record<string, string> = {};

  if (clientOptions !== undefined) {
    const { alertFrequency, directMessageType, threshold } = clientOptions;

    if (alertFrequency !== undefined) {
      record.alertFrequency = alertFrequency;
    }

    if (directMessageType !== undefined) {
      record.directMessageType = directMessageType;
    }

    if (threshold !== undefined) {
      record.threshold = threshold.toString();
    }
  }

  return JSON.stringify(record);
};

const SIGNING_MESSAGE = `Sign in with Notifi \n
    No password needed or gas is needed. \n
    Clicking “Approve” only means you have proved this wallet is owned by you! \n
    This request will not trigger any transaction or cost any gas fees. \n
    Use of our website and service is subject to our terms of service and privacy policy. \n`;
