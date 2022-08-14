<template>
  <div class="subscribeForm">
    <div class="loginButton">
      <Button
        class="p-button-raised p-button-rounded-button-sm"
        @click="handleLogin"
        label="Login"
      />
    </div>
    <div class="communicationChannels">
      <div>
        <label for="email">Email:</label>
        <InputText type="text" label="Email" placeholder="Enter in your full email" v-model="emailAddress" />
      </div>
      <div>
        <label for="name">Telegram Id:</label>
        <InputText type="text" label="TelegramId" placeholder="Enter in your telegram id without @" v-model="telegramId" />
      </div>
    </div>
    <div class="subscriptions">
      <label for="name">Subscribe to Notifi Announcements:</label>
      <InputSwitch type="checkbox" label="subscribeCheckbox" v-model="checkSubscribed" />
    </div>
    <div>
      <Button
        class="p-button-raised p-button-md"
        @click="handleSubmit"
        label="Subscribe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import { handleSubmit, handleLogin } from "../modules/Subscribe";
import type { handleSubmitProps } from "../modules/Subscribe";
import store from "../store/index";

export default {
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
      set(isSubscribed: boolean) {
        store.commit("updateSubscription", !store.state.isSubscribed);
      },
    },
  },
  methods: {
    handleSubmit: function ({
      loading = false,
      checkSubscribed,
      emailInput,
      telegramInput,
    }: handleSubmitProps) {
      handleSubmit({ loading, checkSubscribed, emailInput, telegramInput });
    },
    handleLogin: function () {
      if (store.state.walletStore) handleLogin(store.state.walletStore);
    },
  },
  components: { Button, InputSwitch, InputText },
};
</script>

<style scoped>
input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
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
