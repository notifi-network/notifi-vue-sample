
import type { NotifiEnvironment } from "@notifi-network/notifi-axios-utils";
import { notifiConfigs } from "@notifi-network/notifi-axios-utils";
import { NotifiAxiosService } from "@notifi-network/notifi-axios-adapter";
import { mapGetters, mapMutations, mapActions } from 'vuex';
import type { StateProps } from '../store/index';
import store from "@/store";
import { NewNotifiClient } from '../modules/NotifiClient';
import type { PublicKey } from "@solana/web3.js";
import type { Ref } from "vue";

export default {
	computed: {
	  ...mapGetters([
		'dappAddress',
		'notifiEnvironment',
		'clientState',
		'clientData'
	  ])
	},
	methods: {
	  ...mapMutations([
		'updateClient'
	  ]),
	  ...mapActions({
		updateClient: 'updateClient'
	  })
	}
  }

export const notifiServiceSetup = (notifiEnvironment : NotifiEnvironment) => {
	const { gqlUrl } = notifiConfigs(notifiEnvironment);
	return new NotifiAxiosService({ gqlUrl });
}


type ClientProps = {
	publicKey: Ref<PublicKey | null> | undefined,
	dappAddress: string, 
	notifiService: NotifiAxiosService,
	clientState: StateProps["clientState"];
	clientData: StateProps["clientData"];
}

export const notifiClientSetup = ({ publicKey, dappAddress, notifiService, clientState, clientData } : ClientProps) => {
	if (publicKey === null || publicKey === undefined) {
		return null;
	}

	store.commit('updateClient', {
		clientRandomUuid: null,
		token: null,
		roles: [],
	  });

	return new NewNotifiClient(
		dappAddress,
		publicKey,
		notifiService,
		clientState,
		clientData
	);

}

