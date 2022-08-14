<template>
  <div class="walletButton">
    <wallet-multi-button dark></wallet-multi-button>
  </div>
</template>

<script lang="ts">
import { initWallet } from "solana-wallets-vue";
import "solana-wallets-vue/styles.css";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "solana-wallets-vue";
import store from "../store/index";

import { WalletMultiButton } from "solana-wallets-vue";

const walletOptions = {
  wallets: [new PhantomWalletAdapter()],
  autoConnect: true,
};

async function setFunctionState() {
  await initWallet(walletOptions);
  await store.commit("updateWalletStore", walletOptions.wallets[0]);

  const { publicKey } = await useWallet();

  await store.commit('updatePublicKey', publicKey?.value?.toBase58());

  return;
}


setFunctionState();

export default {
  components: { WalletMultiButton },
};
</script>
