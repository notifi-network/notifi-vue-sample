import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "../src/App.vue";
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputmask';
import router from "./router";

import "./assets/main.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";           

import store from './store/index';

const app = createApp(App).use(store);

app.use(PrimeVue);
app.component('Button', Button);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);

app.use(createPinia());
app.use(router);

app.mount("#app");
