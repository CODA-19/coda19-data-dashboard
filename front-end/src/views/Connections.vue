<template>
  <v-container class="mainContainer">
    <div class="connection">
      <h1>Active Connections</h1>
    </div>
    <div v-if="!connections.length">No active connection</div>
    <ActiveConnection class="col-md-8 offset-md-2"
      v-for="conn in connections"
      v-bind:uid="conn.uid"
      v-bind:name="conn.name"
      v-bind:conn="conn"
      v-bind:key="conn.uid"
    ></ActiveConnection>
  </v-container>
</template>

<script>
import ActiveConnection from "@/components/ActiveConnection";

export default {
    components: {
        ActiveConnection,
    },
    created() {
      fetch('http://localhost:3000/sites')
        .then(res => res.json())
        .then(json => json.connections)
        .then(conn => (this.connections = conn));
    },
    data() {
        return {
            'connections': []
        }
    }
};
</script>
