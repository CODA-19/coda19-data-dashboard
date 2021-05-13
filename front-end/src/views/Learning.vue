<template>
  <v-container class="mainContainer">
  <div class="learning">
     <h1>{{$t('learningTitle')}}</h1>
  </div>
    <div>{{$t('startLearning')}}</div>
    <div class="col-lg-8 offset-lg-2 col-md-12">
    <div class="videoWrapper">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/4zZC7YjGNaE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div></div>
  </v-container>
</template>

<script>
export default {
  name: "Learning"
}
</script>

<style scoped>
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 */
  padding-top: 25px;
  height: 0;
}

.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
