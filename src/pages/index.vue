<template>

  <AppSystemBar />

  <!-- <v-navigation-drawer rail>
    <v-avatar class="d-block text-center mx-auto mt-4" color="grey-darken-1" size="36" />

    <v-divider class="mx-3 my-5" />

    <v-avatar
      v-for="n in 6"
      :key="n"
      class="d-block text-center mx-auto mb-9"
      color="grey-lighten-1"
      size="28"
    />
  </v-navigation-drawer> -->

  <v-navigation-drawer width="244">
    <!-- <v-sheet height="128" width="100%" /> -->

    <v-list>

      <v-list-item>
        <v-btn block color="primary" rounded>Add New</v-btn>
      </v-list-item>

      <AppTooltip v-for="connection in connections" :key="connection.id" location="bottom" text="Double click to connect">
        <v-list-item
          class="user-select-none"
          link
          :title="`${connection.name}`"
          @dblclick="connect(connection)"
        >
          <v-list-item-subtitle>{{ formatConnection(connection) }}</v-list-item-subtitle>
        </v-list-item>
      </AppTooltip>

    </v-list>
  </v-navigation-drawer>

  <!-- <v-app-bar class="px-3" flat height="72">
    <v-spacer />

    <v-responsive max-width="156">
      <v-text-field
        density="compact"
        flat
        hide-details
        rounded="pill"
        variant="solo-filled"
      />
    </v-responsive>
  </v-app-bar> -->

  <v-navigation-drawer location="right">
    <v-list>
      <v-list-item v-for="command in commandsHistory" :key="command.id">

        <v-alert density="compact" style="font-family: monospace;">

          <template #prepend>
            <v-icon
              v-if="command.favorite"
              color="yellow darken-2"
              size="16"
            >
              mdi-star
            </v-icon>
            <v-icon
              v-else
              color="grey lighten-1"
              size="16"
            >
              mdi-star
            </v-icon>
          </template>

          <template #append>
            <v-icon color="success" size="16">mdi-open-in-new</v-icon>
          </template>

          <span class="text-caption text-disabled">
            {{ new Date(command.timestamp).toLocaleString() }}
          </span>

          {{ command.command }}
        </v-alert>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-sheet v-if="terminals.length > 0">
    <v-tabs v-model="tab" color="primary">
      <v-tab v-for="t in terminals" :key="t.id" :value="t.id">
        {{ t.name }}

        <template #append>

          <AppTooltip location="bottom" text="Double click to close tab">

            <v-icon
              class="ml-2"
              size="small"
              @dblclick.stop="closeTab(t.id)"
            >
              mdi-close
            </v-icon>

          </AppTooltip>
        </template>
      </v-tab>
    </v-tabs>

    <v-divider />

    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="t in terminals" :key="t.id" :value="t.id">
        <v-sheet class="pa-3" color="purple">
          {{ t.terminal }}
        </v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>

    <AppFooter />
  </v-sheet>

  <v-empty-state
    v-else
    headline="Welcome,"
    icon="$vuetify"
    title="What would you like to do today?"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            prepend-icon="$vuetify"
            target="_blank"
            text="Start with our dedicated feature guides"
            title="Learn Vuetify"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://play.vuetifyjs.com"
            prepend-icon="$vuetify-play"
            target="_blank"
            text="Test Vuetify out in our playground"
            title="Create a Playground"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://bin.vuetifyjs.com"
            prepend-icon="mdi-delete"
            target="_blank"
            text="Create a new bin to store your code"
            title="Create a Bin"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://issues.vuetifyjs.com"
            prepend-icon="$warning"
            target="_blank"
            text="File a bug report for Vuetify"
            title="Report a Bug"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-empty-state>

</template>

<script setup>
  import { ref } from 'vue'

  const connections = ref([
    {
      id: 1,
      name: 'cliente_a',
      info: {
        ip: '127.0.0.1', port: '22', user: 'usuario',
      },
    },
    {
      id: 2,
      name: 'cliente_b',
      info: {
        ip: '192.168.0.99', port: '2022', user: 'admin',
      },
    },
  ])

  const commandsHistory = ref([
    { id: 1, command: 'ls -la', timestamp: '2024-06-01T12:00:00Z', terminalId: 1, favorite: false },
    { id: 2, command: 'git status', timestamp: '2024-06-01T12:05:00Z', terminalId: 1, favorite: true },
    { id: 3, command: 'docker ps', timestamp: '2024-06-01T12:10:00Z', terminalId: 2, favorite: false },
  ])

  const tab = ref(null)
  const terminals = ref([])

  function formatConnection (connection) {
    return `${connection.info.user}@${connection.info.ip}:${connection.info.port}`
  }

  function connect (connection) {
    const newId = Date.now()
    const terminalName = `${connection.name} (${connection.info.ip})`

    terminals.value.push({
      id: newId,
      name: terminalName,
      terminal: `Connected to ${formatConnection(connection)}`,
    })

    tab.value = newId
  }

  function closeTab (id) {
    terminals.value = terminals.value.filter(t => t.id !== id)

    if (tab.value === id) {
      tab.value = terminals.value.length > 0 ? terminals.value.at(-1).id : null
    }
  }

  onMounted(() => {})
</script>

<style scoped>
/* Impede a seleção de texto especificamente nos itens de lista desta página */
:deep(.v-list-item) {
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE10+ */
}
</style>
