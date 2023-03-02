import { createApp } from 'vue'
import Popper from "vue3-popper"
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"


const app = createApp(App).mount('#app')
app.component("Popper", Popper)

import 'bootstrap/dist/js/bootstrap.js'