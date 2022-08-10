<template>
  <div class="header">
    <div class="metaInfo">
      <div id="dappId"><label>Dapp ID:</label> {{ dappID }}</div>
      <div id="devEnvironment">
        <label>Environment:</label> {{ devEnvironment }}
      </div>
    </div>
    <ConnectWallet></ConnectWallet>
  </div>
</template>

<script lang="ts">
import ConnectWallet from "../components/ConnectWallet.vue";

export default {
  data() {
    return {
      dappID: "ASK-NOTIFI-FOR-DAPP-ID",
      devEnvironment: "development",
    };
  },
  components: { ConnectWallet },
};
</script>

<style scoped>
.metaInfo {
 display: flex;
 flex-direction: row;
 gap: 20px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: black;
  margin-bottom: 50px;
}

#dappId, #devEnvironment {
  display: inline-block;
  white-space: nowrap;
}
</style>
