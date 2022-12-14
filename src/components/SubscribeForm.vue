<template>
  <div v-if="!isConnected" class="connectMessage">
    <Message severity="warn" :closable="false"
      >Please connect your wallet to start using the Notifi SDK</Message
    >
  </div>
  <div v-if="isConnected" class="subscribeForm">
    <div class="loginButton">
      <Button
        class="p-button-raised p-button-rounded-button-sm"
        @click="handleLogin(walletStore)"
      >
        {{ clientState.token ? "Log Out" : "Log In" }}
      </Button>
    </div>
    <div class="communicationChannels">
      <div>
        <label for="email">Email:</label>
        <InputText
          type="text"
          label="Email"
          placeholder="Enter in your full email"
          v-model="emailAddress"
        />
      </div>
      <div>
        <label for="name">Telegram Id:</label>
        <InputText
          type="text"
          label="TelegramId"
          placeholder="Enter in your telegram id without @"
          v-model="telegramId"
        />
      </div>
    </div>
    <div class="subscriptions">
      <label for="name">Subscribe to Notifi Announcements:</label>
      <InputSwitch
        type="checkbox"
        label="subscribeCheckbox"
        v-model="checkSubscribed"
      />
    </div>
    <div>
      <Button
        class="p-button-raised p-button-md"
        @click="
          handleSubmit({
            loading,
            checkSubscribed,
            emailAddress,
            telegramId,
          })
        "
      >
        {{
          clientData == null ||
          clientData.alerts?.find(
            (a: Alert) => a.name === "Vue Sample Alert"
          ) == undefined
            ? "Subscribe"
            : "Save Changes"
        }}
      </Button>
    </div>
    <div>
      <Panel v-if="clientData" header="Debug Data">
        {{ clientData }}
      </Panel>
    </div>
  </div>
</template>

<script lang="ts">
import type { handleSubmitProps } from "../modules/Subscribe";
import { handleSubmit, handleLogin } from "../modules/Subscribe";
import type { Alert } from "@notifi-network/notifi-core";
import Button from "primevue/button";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Message from "primevue/message";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import { useWallet } from "solana-wallets-vue";
import store from "../store/index";
import { mapState } from "vuex";

const { connected } = useWallet();

export default {
  data() {
    return {
      loading: true,
      isConnected: connected,
      checkedSubscribed: null,
    };
  },
  computed: {
    emailAddress: {
      get() {
        return store.state.emailAddress;
      },
      set(email: string) {
        store.commit("updateEmailAddress", email);
      },
    },
    telegramId: {
      get() {
        return store.state.telegramId;
      },
      set(telegramId: string) {
        store.commit("updateTelegramId", telegramId);
      },
    },
    checkSubscribed: {
      get() {
        return store.state.isSubscribed;
      },
      set() {
        store.commit("updateSubscription", !store.state.isSubscribed);
      },
    },
    ...mapState(["walletStore", "clientState", "clientData"]),
  },
  watch: {
    isConnected(connected: boolean) {
      connected;
    },
  },
  methods: {
    handleSubmit: function ({
      loading,
      checkSubscribed,
      emailAddress,
      telegramId,
    }: handleSubmitProps) {
      handleSubmit({ loading, checkSubscribed, emailAddress, telegramId });
    },
    handleLogin: function (walletStore: MessageSignerWalletAdapter) {
      handleLogin(walletStore);
    },
  },
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Button, InputSwitch, InputText, Panel, Message },
};
</script>
