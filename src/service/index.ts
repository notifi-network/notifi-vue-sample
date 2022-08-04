
import type { NotifiEnvironment } from "@notifi-network/notifi-axios-utils";
import { notifiConfigs } from "@notifi-network/notifi-axios-utils";
import { NotifiAxiosService } from "@notifi-network/notifi-axios-adapter";
import axios from 'axios';

const dappAddress : string = 'ASK_NOTIFI_FOR_THIS_VALUE';

const notifiEnvironment : NotifiEnvironment = 'Development';

const notifiService = (notifiEnvironment : NotifiEnvironment) => {
	const { gqlUrl } = notifiConfigs(notifiEnvironment);
	return new NotifiAxiosService({ gqlUrl });
}

export default () => {};
