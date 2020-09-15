<template>
  <div class="legendContainer">

      <div>
        <ul class="ToggleController">
          <li v-for="(site, x) in sites.slice(0,5)" >
            <label class="siteItem">
              <span class="siteIcon" v-bind:style="{background:colors[x]}"></span>
              <span class="siteLabel">{{site}}</span>
            </label>
          </li>
        </ul>
      </div>

      <div v-if="tooManySites()">
        <ul class="ToggleController">
          <li v-for="(site, x) in sites.slice(5,10)">
            <label class="siteItem">
              <span class="siteIcon" v-bind:style="{background:colors.slice(5,10)[x]}"></span>
              <span class="siteLabel">{{site}}</span>
            </label>
          </li>
        </ul>
      </div>

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
    tooManySites(){
      if(this.sites.length>4)
        return true;
      else
        return false;
    }
  }
}
</script>

<style scoped>

</style>
