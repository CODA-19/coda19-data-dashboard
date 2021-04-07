<template>
  <div v-if="!dataReady || dataError" class="hover"> // Show overlay when data is not ready or error occurs

    //Spinner
    <div v-if="!dataReady && !dataError" class="spinner">
      <v-progress-circular
          :size="70"
          :width="7"
          color="#ccc"
          indeterminate
      ></v-progress-circular>
    </div>

    //Error message
    <div v-if="dataError" class="errorMsg">
      <div class="msgContainer">
        <div class="center-block"><i class="fas fa-info-circle fa-5x"></i></div>
        <b> {{ $t("noData") }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/fontawesome.js'
export default {
  name: "PanelOverlay",
  props:{
    dataReady: Boolean,
    dataError: Boolean
  }
}
</script>

<style scoped>
.hover {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
}
.spinner{
  margin: auto;
  position: relative;
  text-align: center;
  top: calc( 50% - 35px );
}
.errorMsg{
  background: #ffffff;
  width: 100%;
  height:100%;
}
.msgContainer{
  position: relative;
  top: 100px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
b{
  font-size: 1.5rem;
}
.center-block{
  color: #ccc;
  margin-bottom: 15px;
}

</style>
