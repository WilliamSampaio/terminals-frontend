<template>
  <v-system-bar class="d-flex justify-center" flat>
    <!-- <v-spacer /> -->

    <!--
    <v-icon>mdi-square</v-icon>
    <v-icon>mdi-triangle</v-icon>
    -->

    <app-tooltip location="bottom" :open-on-hover="true" :text="tooltipText">
      <v-icon
        :class="{
          'led-glow': true, /* Sempre brilha como LED */
          'pulse-animation': alive, /* Só pulsa se estiver vivo */
          'led-red': !alive, /* Estilo específico para vermelho */
          'led-green': alive /* Estilo específico para verde */
        }"
        :color="statusColor"
      >mdi-circle</v-icon>
    </app-tooltip>

  </v-system-bar>
</template>

<script setup>
  import AppTooltip from './AppTooltip.vue'

  const alive = ref(false)

  function ping () {
    fetch(`${window.appConfig?.BACKEND_URL}/api/ping`)
      .then(async response => {
        if (!response.ok) {
          // Handle error response
          alive.value = false
          throw new Error(`HTTP error! status: ${response.status}.`)
        }

        const data = await response.json()

        alive.value = data.alive ? true : false

        if (alive.value === true) {
        // Backend is alive
        } else {
        // Backend is not alive
        }
      })
      .catch(error => {
        // Handle fetch error
        alive.value = false
        console.error('Error fetching API data:', error)
      })
  }

  const statusColor = computed(() => {
    console.log('Alive status:', alive.value)
    return alive.value ? 'green' : 'red'
  })

  const tooltipText = computed(() => {
    return alive.value ? 'Backend is online' : 'Backend is offline'
  })

  onMounted(() => {
    ping()
    setInterval(ping, 2000)
  })
</script>

<style scoped>
.led-glow {
  transition: text-shadow 0.3s ease, color 0.3s ease;
}

.led-green {
  color: #39ff14 !important;
  text-shadow:
    0 0 2px #525252,
    0 0 8px #39ff14,
    0 0 15px #39ff14;
}

.led-red {
  color: #ff0707 !important;
  text-shadow:
    0 0 2px #525252,
    0 0 8px #ff073a,
    0 0 15px #ff073a,
    0 0 25px #ff0000;
}

.pulse-animation {
  animation: fadeout .5s infinite ease-out;
  will-change: opacity, transform;
}

@keyframes fadeout {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
