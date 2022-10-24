import Vue from 'vue'
import App from './App'
import http from './commons/js/http.js';
import io from './components/socket/weapp.socket.io.js';
import API from './commons/js/api.js';
Vue.config.productionTip = false
Vue.prototype.serverUrl = http.serverUrl;
Vue.prototype.baseUrl = http.baseUrl;
Vue.prototype.httpRequest = http.httpRequest;
Vue.prototype.API = API;
Vue.prototype.socket = io(http.socketUrl);

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
