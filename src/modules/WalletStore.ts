import type { PublicKey } from '@solana/web3.js';
import type { WalletAdapter, MessageSignerWalletAdapter } from '@solana/wallet-adapter-base';

export type AdapterValues = Readonly<{
	publicKey: PublicKey | null;
	signerAdapter: MessageSignerWalletAdapter | null;
}>;

export const isMessageSigner = (adapter: WalletAdapter): adapter is MessageSignerWalletAdapter => {
	return (<MessageSignerWalletAdapter>adapter).signMessage !== undefined;
};

export const setAdapterValues = (walletStore : WalletAdapter) : AdapterValues => {
	let publicKey: PublicKey | null = null;
	let signerAdapter: MessageSignerWalletAdapter | null = null;
	const adapter = walletStore ?? null;
	if (adapter === null || adapter.publicKey === null) {
		publicKey = null;
		signerAdapter = null;
	} else {
		publicKey = adapter.publicKey;
		if (isMessageSigner(adapter)) {
			signerAdapter = adapter;
		} else {
			signerAdapter = null;
		}
	}
	return {
		publicKey,
		signerAdapter
	};
};


