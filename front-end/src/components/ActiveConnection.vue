<template>
  <v-card>
    <strong>{{ uid }} - {{ name }}</strong>
    <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>json</v-expansion-panel-header>
      <v-expansion-panel-content>
          <pre>{{ conn }}</pre>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
    props: [ 'uid', 'name', 'conn' ]
};
</script>

<style scoped>
</style>
