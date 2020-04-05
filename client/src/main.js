import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
	debug: true,
	connection: 'http://trivia-chat.ddns.net:3000',
}))

new Vue({
	render: h => h(App),
}).$mount('#app')
