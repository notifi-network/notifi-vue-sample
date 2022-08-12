import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "../src/App.vue";
import PrimeVue from 'primevue/config';
import router from "./router";

import "./assets/main.css";
import store from './store/index';

const app = createApp(App).use(store);

app.use(PrimeVue);
app.use(createPinia());
app.use(router);

app.mount("#app");
