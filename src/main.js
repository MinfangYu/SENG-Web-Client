import {createApp} from 'vue'
import App from './views/App.vue'
import router from "./router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import Api from "./assets/helper/Api";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.axios = axios;
app.config.globalProperties.api = Api;
// this.api.
app.mount('#app');
