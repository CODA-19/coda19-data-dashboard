<template>
  <v-card>
    <v-card-text :class="status">
      <v-row>
        <v-col cols="8" class="test-left">{{ query.name }} - {{ query.endpoint }} - {{ status }}</v-col>
        <v-col cols="4" class="test-right">{{ timeInMs }} ms - HTTP code {{ httpCode }}</v-col>
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

import AxiosInstance from '../api/AxiosInstance';
import TokenBearerHeaderFactory from '../api/TokenBearerHeaderFactory';

export default {
  name: "TestQuery",
  props: ["query", "launch"],
  data() {
    return {
      status: 'NOTLAUNCHED',
      timeMs: NaN,
      httpCode: 'N/A',
      startTime: null
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
      AxiosInstance.get(this.query.endpoint, { headers: headers, timeout: 1000 })
                   .then(res => this.onSuccess(res))
                   .catch(err => this.onError(err));
    },
    onSuccess(response) {
      const httpStatus = response.request.status;
      this.onDone('SUCCESS', httpStatus === 0 ? response.code : httpStatus)
    },
    onError(err) {
      const httpStatus = err.request.status;
      this.onDone('FAILED', httpStatus === 0 ? err.code : httpStatus)
    },
    onDone(cmptStatus, httpStatus) {
      this.timeMs = performance.now() - this.startTime;
      this.status = cmptStatus;
      this.httpCode = httpStatus;
      this.$emit('queryComplete', this.timeMs);
      console.log('emit query completed.');
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
