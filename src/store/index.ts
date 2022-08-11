import { createStore } from "vuex";
import { UPDATE_CLIENT, UPDATE_CLIENT_DATA } from "./mutation-types";
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

export type StateProps = {
  dappAddress: string;
  notifiEnvironment: string;
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
};

const state = {
  dappAddress: "ASK_NOTIFI_FOR_THIS_VALUE",
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
};

const actions = {
  [UPDATE_CLIENT](context: any, clientState: StateProps["clientState"]) {
    context.commit("UPDATE_CLIENT", clientState);
  },
  [UPDATE_CLIENT_DATA](context: any, clientData: StateProps["clientData"]) {
    context.commit("UPDATE_CLIENT_DATA", clientData);
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
