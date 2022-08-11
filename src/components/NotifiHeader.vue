<template>
  <div class="header">
    <div class="metaInfo">
      <div id="dappAddress"><label>Dapp ID:</label> {{ dappAddress }}</div>
      <div id="devEnvironment">
        <label>Environment:</label> {{ notifiEnvironment }}
      </div>
    </div>
    <ConnectWallet></ConnectWallet>
  </div>
</template>

<script lang="ts">
import ConnectWallet from "../components/ConnectWallet.vue";
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({ dappAddress: 'dappAddress', notifiEnvironment: 'notifiEnvironment'})
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
