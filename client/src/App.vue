<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view/>
    <router-view name="footer"></router-view>
  </div>
</template>


<script>


export default {
  watch:{
    '$route' (to, from) {
      document.title = to.meta.title
    }
  }
};
</script>
