<template>
  <div class="header">
    <div class="metaInfo">
      <div id="dappAddress"><label>Dapp ID:</label><InputText v-model="dappAddress"></InputText></div>
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
import InputText from "primevue/inputtext";

export default {
  computed: {
    ...mapState(['dappAddress', 'notifiEnvironment'])
  },
  components: { ConnectWallet, InputText },
};
</script>
