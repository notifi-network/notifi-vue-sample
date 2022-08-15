<template>
  <div class="header">
    <div class="metaInfo">
      <div id="dappAddress">
        <label>Dapp ID:</label>
        <InputText v-model="dappAddress"></InputText>
      </div>
      <div id="devEnvironment">
        <label>Environment:</label>
        <InputText v-model="notifiEnvironment"></InputText>
      </div>
    </div>
    <ConnectWallet></ConnectWallet>
  </div>
</template>

<script lang="ts">
import ConnectWallet from "../components/ConnectWallet.vue";
import InputText from "primevue/inputtext";
import store from "../store/index";

export default {
  data() {
    return {
      environments: [
        { name: "Local" },
        { name: "Production" },
        { name: "Development" },
        { name: "Staging" },
      ],
    };
  },
  components: { ConnectWallet, InputText },
  computed: {
    dappAddress: {
      get() {
        return store.state.dappAddress;
      },
      set(dappAddress: string) {
        store.commit("updateDappAddress", dappAddress);
      },
    },
    notifiEnvironment: {
      get() {
        return store.state.notifiEnvironment;
      },
      set(notifiEnvironment: string) {
        store.commit("updateNotifiEnvironment", notifiEnvironment);
      },
    },
  },
};
</script>
