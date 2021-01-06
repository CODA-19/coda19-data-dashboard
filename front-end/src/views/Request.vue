<template>
  <v-container class="mainContainer">
    <div class="request">
      <h1>{{$t('requestAccessTxt')}}</h1>
    </div>
      <div class="text">
      <p>{{$t('requestAccessDescriptionTxt')}}</p>
      <a :href="$t('mailRequestAccessTxt')" target="_blank">access@coda19.ca</a>
    </div>
  </v-container>
</template>