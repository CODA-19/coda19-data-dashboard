<template>

<!--    <v-container class="mainContainer">-->
<!--      <Forest title="CODA-19"/>-->
<!--    </v-container>-->
  <keep-alive>
    <component v-bind:is="component" v-bind:summary="summary" v-bind:lengthOfStay="length_of_stay" v-bind:ageGroups="age_groups"/>
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
      this.summary = data.summary;//{data:data.data, types: data.types, ranges: data.ranges, means: data.means};
      this.length_of_stay = data.length_of_stay;
      this.age_groups = data.age_groups;
      this.component = "Dashboard"
    });
    bus.$on("newSearch", ()=>{
      this.component = "SelectData"
    })
  },
  data() {
    return {
      component: 'SelectData',
      summary: {},
      length_of_stay: [],
      age_groups: []
    }
  }
}
</script>
