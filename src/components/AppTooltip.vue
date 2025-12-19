<template>
  <v-tooltip
    v-model="tooltipVisible"
    :disabled="disabled"
    :location="location"
    :open-delay="delay"
    :open-on-click="true"
    :open-on-hover="openOnHover"
    :text="text"
  >
    <template #activator="{ props: tooltipProps }">
      <span
        v-bind="tooltipProps"
        @mouseleave="closeTooltip"
      >
        <slot />
      </span>
    </template>
  </v-tooltip>
</template>

<script setup>
  import { onBeforeUnmount, ref, watch } from 'vue'

  const props = defineProps({
    text: { type: String, required: true },
    location: { type: String, default: 'bottom' },
    disabled: { type: Boolean, default: false },
    delay: { type: [String, Number], default: 200 },
    // Tempo em milissegundos para o tooltip sumir sozinho
    duration: { type: Number, default: 1500 },
    openOnHover: { type: Boolean, default: false },
  })

  const tooltipVisible = ref(false)
  let timer = null

  // Função para limpar o timer e fechar
  function closeTooltip () {
    tooltipVisible.value = false
    if (timer) clearTimeout(timer)
  }

  // Monitora quando o tooltip abre
  watch(tooltipVisible, isOpen => {
    if (isOpen) {
      // Se abrir, inicia a contagem regressiva para fechar
      if (timer) clearTimeout(timer) // Limpa timer anterior se houver

      timer = setTimeout(() => {
        tooltipVisible.value = false
      }, props.duration)
    } else {
      // Se fechar manualmente, limpa o timer
      if (timer) clearTimeout(timer)
    }
  })

  // Limpeza ao destruir o componente para evitar vazamento de memória
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })
</script>
