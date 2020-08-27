<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Forest title="CODA-19"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Forest from '@/components/Forest.vue'

export default {
  name: 'Home',
  components: {
    Forest
  }
}
</script>
