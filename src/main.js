// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

async function initApp () {
  const response = await fetch('/config.json')
  const config = await response.json()

  window.appConfig = config

  const app = createApp(App)

  // 2. Torna a config disponível via Provide (para componentes)
  app.provide('config', config)

  // 3. Opcional: Torna disponível globalmente via window (para arquivos JS puros)
  window.appConfig = config

  registerPlugins(app)

  app.mount('#app')
}

initApp()
