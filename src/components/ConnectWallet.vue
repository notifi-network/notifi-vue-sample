<template>
  <div class="walletButton">
   <WalletMulitWallet></WalletMulitWallet>
  </div>
</template>

<script lang="ts">
import SolanaWallets, { initWallet } from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { WalletMultiButton } from 'solana-wallets-vue'

export default {
  components: {WalletMultiButton}
}

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
}
initWallet(walletOptions);
</script>

<style>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.walletButton {
  width: 100%;
  text-align: right;
}

</style>
