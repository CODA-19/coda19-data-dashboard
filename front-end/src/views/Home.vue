<template>
  <component
    v-bind:is="component"
    v-bind:summary="summary"
    v-bind:sites="sites"
    v-bind:lengthOfStay="length_of_stay"
    v-bind:ageGroups="age_groups"

    v-bind:connections="connections"
    v-bind:resources="resources"
  />
</template>

<script>
// @ is an alias to /src
import Forest from "@/components/Forest.vue";
import Dashboard from "@/views/Dashboard";
import SelectData from "@/views/SelectData";
import Connections from "@/views/Connections";
import { bus } from "@/main";

const intersection = (...sets) => sets.reduce((acc, el) => acc.filter({}.hasOwnProperty.bind(el)), Object.keys(sets[0]));
const getSiteKeys = (resources) => resources.reduce((acc, el) => { acc[`${el.type}|${el.attribute}|${el.datatype}`] = el; return acc; }, {});

export default {
  components: {
    Connections,
    Dashboard,
    SelectData,
    Forest,
  },
  props: { },
  created() {
    bus.$on("showDashboard", (data) => {
      this.summary = data.summary;
      this.sites = data.summary.sites;
      //this.length_of_stay = data.length_of_stay;
      //this.age_groups = data.age_groups;
      this.component = "Dashboard";
    });

    bus.$on("newSearch", () => {
      this.component = "SelectData";

      fetch('http://localhost:3000/sites')
          .then(res => res.json())
          .then(json => json.connections)
          .then(conn => this.load(conn));
    });

    fetch('http://localhost:3000/sites')
      .then(res => res.json())
      .then(json => json.connections)
      .then(conn => this.load(conn));
  },
  data() {
    return {
      component: "SelectData",
      summary: {},
      sites: [],
      length_of_stay: [],
      age_groups: [],
      // -- Down is good --
      connections: [],
      resources: [],
    };
  },
  methods: {
    load: function(connections) { 
      // Loading active connections
      this.connections = connections.map(conn => Object.assign({}, conn)); // Clone for safety

      // Finding common set of resources.
      const siteResources = connections.map(conn => getSiteKeys(conn.resources));
      const commonRes = intersection(...siteResources);

      // Take resource definition from 
      this.resources = commonRes.map(key => {
        let type, attr, dtype;
        [ type, attr, dtype ] = key.split('|');
        return { type: type, attribute: attr, datatype: dtype }
      });
    }
  }
};
</script>
