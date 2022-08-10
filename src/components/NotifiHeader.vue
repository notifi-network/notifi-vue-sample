<template>
  <div class="header">
    <div class="metaInfo">
      <div id="dappId"><label>Dapp ID:</label> {{ dappID }}</div>
      <div id="devEnvironment">
        <label>Dev Environment:</label> {{ devEnvironment }}
      </div>
    </div>
    <WalletMulitWallet></WalletMulitWallet>
  </div>
</template>

<script>
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
.header {
  display: flex;
  flex-direction: "row";
  justify-content: "flex-end";
  align-items: center;
  gap: 10px;
  color: black;
}
</style>
