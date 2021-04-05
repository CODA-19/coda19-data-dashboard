<template>
  <v-card>
    <v-card-text :class="status">
      <v-row>
        <v-col cols="4" class="test-left">{{ query.name }} - {{ query.endpoint }} - {{ status }}</v-col>
        <v-col cols="4" class="test-left">{{ timeInMs }} ms - HTTP code {{ httpCode }}</v-col>
        <v-col cols="4" class="test-right">{{ reason }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.INPROGRESS { background-color: yellow; }
.FAILED { background-color: crimson; }
.SUCCESS { background-color: lightgreen; }
.NOTLAUNCHED { background-color: darkgray; }
</style>

<script>

import TokenBearerHeaderFactory from '../api/TokenBearerHeaderFactory';
import axios from "axios";

export default {
  name: "TestQuery",
  props: ["query", "launch"],
  data() {
    return {
      status: 'NOTLAUNCHED',
      timeMs: NaN,
      httpCode: 'N/A',
      startTime: null,
      reason: ''
    };
  },
  computed: {
    timeInMs() {
      return this.timeMs.toFixed(0);
    }
  },
  methods: {
    makeRequest() {
      this.status = 'INPROGRESS';
      const headers = TokenBearerHeaderFactory.get();
      this.startTime = performance.now();
      axios.create({
        baseURL: process.env.VUE_APP_CODA19_DASHBOARD_BACKEND_URL,
        timeout: 30000,
      }).get(this.query.endpoint, { headers: headers })
       .then(res => this.onSuccess(res))
       .catch(err => this.onError(err));
    },
    onSuccess(response) {
      const httpStatus = response.request.status;
      this.onDone('SUCCESS', httpStatus === 0 ? response.code : httpStatus)
    },
    onError(err) {
      const httpStatus = err.request.status;
      console.error(`${this.query.name} failed with reason ${err.request.response}`);
      this.reason = err.request.response;
      this.onDone('FAILED', httpStatus === 0 ? err.code : httpStatus)
    },
    onDone(cmptStatus, httpStatus) {
      this.timeMs = performance.now() - this.startTime;
      this.status = cmptStatus;
      this.httpCode = httpStatus;
      this.$emit('queryComplete', this.timeMs);
    }
  },
  watch: {
    'launch': function() {
      if (!this.launch) { return }
      this.makeRequest();
    }
  }
}
</script>
