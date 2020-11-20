<template>
  <div id="app">
    <router-view name="header" :keycloak="keycloak"></router-view>
    <router-view/>
    <router-view name="footer"></router-view>
  </div>
</template>


<script>


export default {
  props: ['keycloak'],
  watch:{
    '$route' (to, from) {
      document.title = to.meta.title
    }
  }
};
</script>
