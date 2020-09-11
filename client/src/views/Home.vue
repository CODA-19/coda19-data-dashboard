<template>

<!--    <v-container class="mainContainer">-->
<!--      <Forest title="CODA-19"/>-->
<!--    </v-container>-->
  <keep-alive>
    <component v-bind:is="component" v-bind:summary="summary"/>
  </keep-alive>

</template>

<script>
// @ is an alias to /src
import Forest from '@/components/Forest.vue'
import Dashboard from "@/views/Dashboard";
import SelectData from "@/views/SelectData";
import { bus } from "@/main"

export default {
  name: 'Home',
  components: {
    Dashboard,
    SelectData,
    Forest
  },
  props:{

  },
  created(){
    bus.$on("showDashboard", (data)=>{
      this.summary = data;//{data:data.data, types: data.types, ranges: data.ranges, means: data.means};
      this.component = "Dashboard"
    });
    bus.$on("newSearch", ()=>{
      this.component = "SelectData"
    })
  },
  data() {
    return {
      component: 'SelectData',
      summary: {}
    }
  }
}
</script>
