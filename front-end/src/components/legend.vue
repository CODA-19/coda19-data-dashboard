<template>
  <div :class="'legendContainer '+direction">

      <div :class="direction==='horizontal'? 'col-lg-6 col-md-12 col-sm-12':''" >
        <ul class="ToggleController">
          <li v-for="(site, x) in sites.slice(0,5)" >
            <label class="siteItem" v-model="highlight" @mousemove="$emit('update:highlight', site)" @mouseout="$emit('update:highlight', null)">
              <span class="siteIcon" :class="site ==='Mean' ? 'Mean' : ''" v-bind:style="{background:colors[x]}"></span>
              <span class="siteLabel">{{site ==="Mean" ? $t('meanTxt') : site}}</span>
            </label>
          </li>
        </ul>
      </div>

      <div v-if="tooManySites()" :class="direction==='horizontal'? 'col-lg-6 col-md-12 col-sm-12':''">
        <ul class="ToggleController">
          <li v-for="(site, x) in sites.slice(5,10)"  >
            <label class="siteItem" v-model="highlight" @mousemove="$emit('update:highlight', site)" @mouseout="$emit('update:highlight', null)">
              <span class="siteIcon" v-if="site!==''" :class="site ==='Mean' ? 'Mean' : ''"  v-bind:style="{background:colors.slice(5,10)[x]}"></span>
              <span class="siteLabel">{{site ==="Mean" ? $t('meanTxt') : site}}</span>
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
    },
    highlight:{
      type: String
    },
    direction:{
      type: String
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
