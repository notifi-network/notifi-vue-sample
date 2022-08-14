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
        label="Login"
      />
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
          handleSubmit({ loading, checkSubscribed, emailAddress, telegramId })
        "
        label="Subscribe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { handleSubmit, handleLogin } from "../modules/Subscribe";
import { mapState } from 'vuex';
import type { handleSubmitProps } from "../modules/Subscribe";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import { useWallet } from "solana-wallets-vue";
import store from "../store/index";

const { connected } = useWallet();

export default {
  data() {
    return {
      loading: true,
      isConnected: connected,
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
    ...mapState(['walletStore']),
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
      emailInput,
      telegramInput,
    }: handleSubmitProps) {
      handleSubmit({ loading, checkSubscribed, emailInput, telegramInput });
    },
    handleLogin: function (walletStore: MessageSignerWalletAdapter) {
      handleLogin(walletStore);
    },
  },
  components: { Button, InputSwitch, InputText, Message },
};
</script>

<style scoped>
input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}

.connectMessage {
  text-align: center;
}

.communicationChannels {
  display: flex;
  align-items: left;
  flex-direction: column;
  gap: 20px;
}

.subscribeForm {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  color: black;
}

.subscriptions {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 15px;
}
</style>
