<script setup lang="ts">
import { WalletMultiButton } from 'solana-wallets-vue'
</script>

<template>
  <div class="greetings">
   <wallet-multi-button></wallet-multi-button>
  </div>
</template>

<script lang="ts">
import App from './App.vue';
import SolanaWallets from 'solana-wallets-vue';

// You can either import the default styles or create your own.
import 'solana-wallets-vue/styles.css';

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
}

import { initWallet } from 'solana-wallets-vue';
initWallet(walletOptions);
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
