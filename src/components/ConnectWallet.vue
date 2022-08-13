<template>
  <div class="walletButton">
   <wallet-multi-button dark></wallet-multi-button>
  </div>
</template>

<script lang="ts">
import { initWallet } from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import store from '../store/index';

import { WalletMultiButton } from 'solana-wallets-vue'

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
  ],
  autoConnect: true,
}

initWallet(walletOptions);

store.commit('updateWalletStore', walletOptions.wallets[0])

export default {
  components: {WalletMultiButton}
}

</script>
