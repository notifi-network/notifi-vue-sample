<template>
  <div class="walletButton">
   <wallet-multi-button dark></wallet-multi-button>
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

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: false,
}
initWallet(walletOptions);

export default {
  components: {WalletMultiButton}
}

</script>
