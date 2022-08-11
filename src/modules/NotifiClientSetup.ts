
import type { NotifiEnvironment } from "@notifi-network/notifi-axios-utils";
import { notifiConfigs } from "@notifi-network/notifi-axios-utils";
import { NotifiAxiosService } from "@notifi-network/notifi-axios-adapter";
import type { AdapterValues } from "./WalletStore";
import { mapGetters, mapMutations, mapActions } from 'vuex';
import type { StateProps } from '../store/index';
import store from "@/store";
import { NewNotifiClient } from '../modules/NotifiClient';

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

const notifiService = (notifiEnvironment : NotifiEnvironment) => {
	const { gqlUrl } = notifiConfigs(notifiEnvironment);
	return new NotifiAxiosService({ gqlUrl });
}

type ClientProps = {
	adapterValues: AdapterValues, 
	dappAddress: string, 
	notifiService: NotifiAxiosService,
	clientState: StateProps["clientState"];
	clientData: StateProps["clientData"];
}

export const notifiClient = ({adapterValues, dappAddress, notifiService, clientState, clientData } : ClientProps) => {
	if (adapterValues.publicKey === null) {
		return null;
	}

	store.dispatch('UPDATE_CLIENT', {
		clientRandomUuid: null,
		token: null,
		roles: [],
	  });

	return new NewNotifiClient(
		dappAddress,
		adapterValues.publicKey,
		notifiService,
		clientState,
		clientData
	);

}

