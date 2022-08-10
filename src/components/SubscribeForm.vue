<template>
  <div class="subscribeForm">
    <div class="communicationChannels">
      <div>
        <label for="email">Email:</label>
        <input type="text" label="Email" />
      </div>
      <div>
        <label for="name">Telegram Id:</label>
        <input type="text" label="TelegramId" />
      </div>
    </div>
    <div class="subscriptions">
      <label for="name">Subscribe to Notifi Announcements:</label>
      <input type="checkbox" checked>
      <span class="slider"></span>
    </div>
    <div>
      <md-button class="subscribeButton">Subscribe</md-button>
    </div>
  </div>
</template>

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

.subscribeButton {
  background-color: #ff7f50; /*coral*/
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
}
</style>
