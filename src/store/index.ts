import { createStore } from "vuex";
import {
  UPDATE_CLIENT,
  UPDATE_CLIENT_DATA,
  UPDATE_EMAIL,
  UPDATE_TELEGRAM,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_WALLET_STORE,
} from "./mutation-types";
import type {
  Alert,
  EmailTarget,
  Filter,
  SmsTarget,
  Source,
  SourceGroup,
  TargetGroup,
  TelegramTarget,
} from "@notifi-network/notifi-core";
import type { NotifiEnvironment } from "@notifi-network/notifi-axios-utils";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import type { ActionContext } from "vuex";

export type StateProps = {
  dappAddress: string;
  notifiEnvironment: NotifiEnvironment;
  clientState: {
    clientRandomUuid: number | null;
    token: string | null;
    roles: Array<string>;
  };
  clientData: {
    alerts: ReadonlyArray<Alert>;
    filters: ReadonlyArray<Filter>;
    sources: ReadonlyArray<Source>;
    sourceGroups: ReadonlyArray<SourceGroup>;
    targetGroups: ReadonlyArray<TargetGroup>;
    emailTargets: ReadonlyArray<EmailTarget>;
    smsTargets: ReadonlyArray<SmsTarget>;
    telegramTargets: ReadonlyArray<TelegramTarget>;
  };
  emailAddress: string | null;
  telegramId: string | null;
  isSubscribed: boolean;
  walletStore: MessageSignerWalletAdapter | undefined;
};

const state: StateProps = {
  dappAddress: "notifi",
  notifiEnvironment: "Development",
  clientState: {
    clientRandomUuid: null,
    token: null,
    roles: [],
  },
  clientData: {
    alerts: [],
    filters: [],
    sources: [],
    sourceGroups: [],
    targetGroups: [],
    emailTargets: [],
    smsTargets: [],
    telegramTargets: [],
  },
  emailAddress: null,
  telegramId: null,
  isSubscribed: false,
  walletStore: undefined,
};

const getters = {
  getClientState: (state: StateProps) => () => {
    return state.clientState;
  },
  getClientData: (state: StateProps) => () => {
    return state.clientData;
  },
  getCommunicationChannels: (state: StateProps) => () => {
    return state.emailAddress, state.telegramId;
  },
  getDappAddress: (state: StateProps) => () => {
    return state.dappAddress;
  },
  getNotifiEnvironment: (state: StateProps) => () => {
    return state.notifiEnvironment;
  },
};

const mutations = {
  [UPDATE_CLIENT](state: StateProps, clientState: StateProps["clientState"]) {
    return (state.clientState = { ...clientState });
  },
  [UPDATE_CLIENT_DATA](
    state: StateProps,
    clientData: StateProps["clientData"]
  ) {
    return (state.clientData = { ...clientData });
  },
  [UPDATE_EMAIL](state: StateProps, emailAddress: string) {
    return (state.emailAddress = emailAddress);
  },
  [UPDATE_TELEGRAM](state: StateProps, telegramId: string) {
    return (state.telegramId = telegramId);
  },
  [UPDATE_IS_SUBSCRIBED](state: StateProps, isSubscribed: boolean) {
    return (state.isSubscribed = isSubscribed);
  },
  [UPDATE_WALLET_STORE](
    state: StateProps,
    walletStore: MessageSignerWalletAdapter
  ) {
    return (state.walletStore = walletStore);
  },
};

const actions = {
  [UPDATE_CLIENT](
    context: ActionContext<StateProps, StateProps>,
    clientState: StateProps["clientState"]
  ) {
    context.commit("updateClient", clientState);
  },
  [UPDATE_CLIENT_DATA](
    context: ActionContext<StateProps, StateProps>,
    clientData: StateProps["clientData"]
  ) {
    context.commit("updateClientData", clientData);
  },
  [UPDATE_EMAIL](
    context: ActionContext<StateProps, StateProps>,
    email: string
  ) {
    context.commit("updateEmail", email);
  },
  [UPDATE_TELEGRAM](
    context: ActionContext<StateProps, StateProps>,
    telegram: string
  ) {
    context.commit("updateTelegram", telegram);
  },
  [UPDATE_IS_SUBSCRIBED](
    context: ActionContext<StateProps, StateProps>,
    isSubscribed: boolean
  ) {
    context.commit("updateIsSubscribed", isSubscribed);
  },
  [UPDATE_WALLET_STORE](
    context: ActionContext<StateProps, StateProps>,
    walletStore: MessageSignerWalletAdapter
  ) {
    context.commit("updateWalletStore", walletStore);
  },
};

const modules = {};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules,
});
