<template>
  <div class="subscribeForm">
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
      <InputSwitch v-model="isSubscribed" />
    </div>
    <div>
      <Button class="p-button-raised p-button-rounded p-button-lg" label="Subscribe" />
    </div>
  </div>
</template>

<script lang="ts">
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import {mapState} from 'vuex';

export default {
    computed: {
       ...mapState({emailAddress: 'emailAddress', telegramId: 'telegramId', isSubscribed: 'isSubscribed'})
    },
    components: {InputSwitch, Button}
}

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
