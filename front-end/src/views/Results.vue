<template>
  <v-container class="mainContainer">
      <v-card class="resultContainer">
        <div class="panelTitle">
          <span>{{ $t("resultsTxt") }}</span>
        </div>
        <div class="resultPanel">
          <div class="subPanel" v-for="(table,idx) in tables">
            <div class="tableTitle"><span class="tableIdx">{{$t('tableTxt')+(idx+1)+"."}}</span><span>{{table.name}}</span></div>
            <b-table
                :striped="false"
                :bordered="false"
                :borderless="true"
                :outlined="false"
                :small="true"
                :hover="false"
                :dark="false"
                :fixed="false"
                :foot-clone="false"
                :no-border-collapse="false"
                :items="table.items"
                :fields="table.fields"
                :head-variant="null"
                :table-variant="'light'"
            ></b-table>
          </div>
          <v-divider></v-divider>
          <div class="subPanel" v-for="(figure, idx) in figures">
            <div class="tableTitle"><span class="tableIdx">{{$t('figureTxt')+(idx+1)+"."}}</span><span>{{figure.name}}</span></div>
            <BarChart style="height: 40vh" v-bind:colors="colors"  v-bind:data="figure.data" :labels="siteLabels" autoresize></BarChart>
          </div>

        </div>
      </v-card>

  </v-container>

</template>

<script>
import BarChart from "@/components/barChart";
import { bus } from "@/main";
import Const from "@/const";

export default {
  name: "Results",
  components: { BarChart},
  props:{
    summary: {
      type: Object
    },
    sites:{
      type: Array
    },
    lengthOfStay:{
      type: Array
    },
    ageGroups:{
      type: Array
    }
  },
  computed:{
    legendSites(){
      var legendSites = this.sites;
      legendSites.push('Mean');
      return legendSites;
    },
    legendColors(){
      var legendColors = Const.colors.slice(0, this.sites.length-1);
      legendColors.push('black');
      return legendColors;
    }
  },
  methods:{
    newSearch() {
      bus.$emit('newSearch')
    }
  },
  data(){
    return {
      colors: Const.colors,
      tables:[
        {name: "Summary Of Patient.age",
            fields: ['site','mean', 'stdev', 'ci95', 'count'],
            items: [
              { site: 'CHUM', mean: 72, stdev: 23, ci95:'20-95', count:1766 },
              { site: "MUHC", mean: 75, stdev: 21, ci95:'22-99', count:649},
              { site: 'JGH', mean: 70, stdev: 22, ci95:'21-94', count:841 }
            ]

        },
        {name: "Summary Of Patient.gender",
            fields: ['site','male', 'female', 'total', 'mode'],
            items: [
              { site: 'CHUM', male: 972, female: 923, total:1895, mode:'male' },
              { site: "MUHC", male: 485, female: 321, total:806, mode:'male'},
              { site: 'JGH', male: 622, female: 750, total:1372, mode:'female' }
            ]

        }
      ],
      figures:[
        {
          name: 'Summary of Patient.age at each site',
          data:[
          ['category','101','102','103'],
          ['',10, 6, 4]]
        }

      ],
      siteLabels:{
        101:{
          en:'101',
          fr:'101'
        },
        102:{
          en:'102',
          fr:'102'
        },
        103:{
          en:'103',
          fr:'103'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
