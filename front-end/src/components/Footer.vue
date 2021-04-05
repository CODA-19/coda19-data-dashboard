<template>
  <v-card>
    <v-footer absolute class="font-weight-medium" >
      <v-col class="text-center" cols="11">
        <strong>CODA-19</strong>, {{ new Date().getFullYear() }}
      </v-col>
      <v-col class="text-right" cols="1">
        <router-link to="/homemetrics" class="nav-link">{{ $t('homeMetricsTxt') }}</router-link>
      </v-col>
    </v-footer>
  </v-card>
</template>
