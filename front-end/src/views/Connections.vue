<template>
  <v-container class="mainContainer">
    <div class="connection">
       <h1>{{$t('activeConnectionsTxt')}}</h1>
    </div>
    <div v-if="!connections.length">{{$t('noActiveConnectionsTxt')}}</div>
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
import SiteApi from '@/api/SiteApi'

export default {
    components: {
        ActiveConnection,
    },
    created() {
      SiteApi.get()
        .then(res => res.data)
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
