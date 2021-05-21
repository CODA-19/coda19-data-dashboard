<template>
  <v-card>
    <v-row>
      <v-col cols="1" style="margin: auto 0; text-align: center;">
        <span class="circle blink"></span>
      </v-col>
      <v-col cols="11">
        <strong>{{ uid }} - {{ name }}</strong>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>json</v-expansion-panel-header>
            <v-expansion-panel-content>
              <pre>{{ conn }}</pre>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
    props: [ 'uid', 'name', 'conn' ]
};
</script>

<style scoped>
.circle:before {
  content: '\25CF';
  font-size: 50px;
}

.blink {
  animation: blinker 3s linear infinite;
  color: #339933;
}

@keyframes blinker {
  90% {
    opacity: 0;
  }
}
</style>
