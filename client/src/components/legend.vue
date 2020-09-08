<template>
  <div class="legendContainer">
  <ul id="ToggleController">
    <li v-for="(site, x) in sites" v-if="isCategoryToShow(x)" v-bind:key="x">
      <label class="checkbox-button">
        <input v-bind:value="x"  v-bind:id="colors[x]" type="checkbox" checked="checked" class="checkbox-button__input"/>
        <span class="checkbox-button__control"></span>
        <span class="checkbox-button__label">{{site}}</span>
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
