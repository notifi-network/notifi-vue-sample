<template>
  <div class="subscribeForm">
    <div class="loginButton">
      <Button
        class="p-button-raised p-button-rounded p-button-lg"
        @click="handleLogin"
        label="Login"
      />
    </div>
    <div class="communicationChannels">
      <div>
        <label for="email">Email:</label>
        <input type="text" label="Email" v-model="emailAddress" />
      </div>
      <div>
        <label for="name">Telegram Id:</label>
        <input type="text" label="TelegramId" v-model="telegramId" />
      </div>
    </div>
    <div class="subscriptions">
      <label for="name">Subscribe to Notifi Announcements:</label>
      <input type="checkbox" label="subscribeCheckbox" v-model="isSubscribed" />
    </div>
    <div>
      <Button
        class="p-button-raised p-button-rounded p-button-lg"
        @click="handleSubmit"
        label="Subscribe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Button from "primevue/button";
import { handleSubmit, handleLogin, adapter } from "../modules/Subscribe";
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
    isSubscribed: {
      get() {
        return store.state.isSubscribed;
      },
      set(isSubscribed: boolean) {
        store.commit("updateSubscription", !isSubscribed);
      },
    },
  },
  methods: {
    handleSubmit: function ({
      loading = false,
      emailInput = store.state.emailAddress,
      telegramInput = store.state.telegramId,
    }: handleSubmitProps) {
      handleSubmit({ loading, emailInput, telegramInput });
    },
    handleLogin: function (newAdapter = adapter) {
      handleLogin(newAdapter);
    },
  },
  components: { Button },
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
</style>
