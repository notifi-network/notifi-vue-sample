<template>
  <div class="walletButton">
    <wallet-multi-button dark></wallet-multi-button>
  </div>
</template>

<script lang="ts">
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { initWallet, WalletMultiButton } from "solana-wallets-vue";
import store from "../store/index";
import "solana-wallets-vue/styles.css";

const walletOptions = {
  wallets: [new PhantomWalletAdapter()],
  autoConnect: true,
};

initWallet(walletOptions);
store.commit("updateWalletStore", walletOptions.wallets[0]);

export default {
  components: { WalletMultiButton },
};
</script>
