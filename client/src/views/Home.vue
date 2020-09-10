<template>

<!--    <v-container class="mainContainer">-->
<!--      <Forest title="CODA-19"/>-->
<!--    </v-container>-->
  <keep-alive>
    <component v-bind:is="component" />
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
  created(){
    bus.$on("showDashboard", ()=>{
      this.component = "Dashboard"
    });
    bus.$on("newSearch", ()=>{
      this.component = "SelectData"
    })
  },
  data() {
    return {
      component: 'SelectData'
    }
  }
}
</script>
