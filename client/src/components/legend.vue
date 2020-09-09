<template>
  <div class="legendContainer">
  <ul id="ToggleController">
    <li v-for="(site, x) in sites" v-if="isCategoryToShow(x)" v-bind:key="x">
      <label class="siteItem">
        <span class="siteIcon" v-bind:style="{background:colors[x]}"></span>
        <span class="siteLabel">{{site}}</span>
      </label>
    </li>
  </ul>
  </div>
</template>

<script>
export default {
  name: "Legend",
  props:{
    colors:{
      type: Array
    },
    sites:{
      type: Array
    }
  },
  methods:{
    isCategoryToShow(x){
      return true
    }
  }
}
</script>

<style scoped>

</style>
