<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card prepend-icon="mdi-keyboard" title="Ação Rápida">
      <v-card-text>
        Você ativou este menu pressionando a tecla <strong>Espaço</strong> duas vezes rapidamente.
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Fechar" @click="dialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'

  const dialog = ref(false)
  let lastKeyPressTime = 0
  const DOUBLE_PRESS_DELAY = 300 // Tempo máximo entre cliques (ms)

  function handleKeyDown (event) {
    // Verificamos se o foco não está em um campo de texto/input
    const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      || document.activeElement.isContentEditable

    if (isInput) return

    // Mapeamos a tecla desejada (ex: ' ' é a tecla Espaço)
    if (event.key === ' ') {
      const currentTime = Date.now()
      const timeDiff = currentTime - lastKeyPressTime

      if (timeDiff > 0 && timeDiff < DOUBLE_PRESS_DELAY) {
        // Previne o scroll da página ao apertar espaço
        event.preventDefault()

        // Abre o dialog
        dialog.value = true

        // Reseta o tempo para não disparar triplos cliques seguidos
        lastKeyPressTime = 0
      } else {
        lastKeyPressTime = currentTime
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
</script>
