import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "../src/App.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Dropdown from 'primevue/dropdown';
import Message from "primevue/message";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputmask";
import Panel from "primevue/panel";
import router from "./router";

import "./assets/main.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";

import store from "./store/index";

const app = createApp(App).use(store);

app.use(PrimeVue);
// eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.component("InputSwitch", InputSwitch);
app.component("InputText", InputText);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Panel", Panel);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Message", Message);

app.use(createPinia());
app.use(router);

app.mount("#app");
