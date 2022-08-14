import { createStore } from "vuex";
import { UPDATE_CLIENT, UPDATE_CLIENT_DATA, UPDATE_EMAIL, UPDATE_TELEGRAM, UPDATE_IS_SUBSCRIBED, UPDATE_WALLET_STORE, UPDATE_PUBLIC_KEY } from "./mutation-types";
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

export type StateProps = {
  dappAddress: string;
  notifiEnvironment: NotifiEnvironment;
  clientState: {
    clientRandomUuid: number | null;
    token: string | null;
    roles: Array<string>;
  };
  clientData: {
    alerts: ReadonlyArray<Alert>,
    filters: ReadonlyArray<Filter>,
    sources: ReadonlyArray<Source>,
    sourceGroups: ReadonlyArray<SourceGroup>,
    targetGroups: ReadonlyArray<TargetGroup>,
    emailTargets: ReadonlyArray<EmailTarget>,
    smsTargets: ReadonlyArray<SmsTarget>,
    telegramTargets: ReadonlyArray<TelegramTarget>,
  }
  emailAddress: string | null;
  telegramId: string | null;
  isSubscribed: boolean;
  walletStore: MessageSignerWalletAdapter | undefined;
  publicKey: string;
};

const state : StateProps = {
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
  publicKey: '',
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
  [UPDATE_CLIENT_DATA](state: StateProps, clientData: StateProps["clientData"]) {
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
  [UPDATE_WALLET_STORE](state: StateProps, walletStore: MessageSignerWalletAdapter) {
    return (state.walletStore = walletStore);
  },
  [UPDATE_PUBLIC_KEY](state: StateProps, publicKey: string) {
    return (state.publicKey = publicKey);
  }
};

const actions = {
  [UPDATE_CLIENT](context: any, clientState: StateProps["clientState"]) {
    context.commit("UPDATE_CLIENT", clientState);
  },
  [UPDATE_CLIENT_DATA](context: any, clientData: StateProps["clientData"]) {
    context.commit("UPDATE_CLIENT_DATA", clientData);
  },
  [UPDATE_EMAIL](context: any, email: string) {
    context.commit("UPDATE_EMAIL", email);
  },
  [UPDATE_TELEGRAM](context: any, telegram: string) {
    context.commit("UPDATE_TELEGRAM", telegram);
  },
  [UPDATE_IS_SUBSCRIBED](context: any, isSubscribed: boolean) {
    context.commit("UPDATE_IS_SUBSCRIBED", isSubscribed);
  },
  [UPDATE_WALLET_STORE](context: any,  walletStore: MessageSignerWalletAdapter) {
    context.commit("UPDATE_WALLET_STORE", walletStore);
  },
  [UPDATE_PUBLIC_KEY](context: any,  publicKey: string) {
    context.commit("UPDATE_PUBLIC_KEY", publicKey);
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
