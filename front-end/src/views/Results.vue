<template>
  <v-container class="mainContainer">
      <v-card class="resultContainer">
        <div class="panelTitle">
          <span>{{ $t("resultsTxt") }}</span>
        </div>
        <div class="resultPanel">
          <div class="subPanel" v-for="(table,idx) in tables">
            <div class="tableTitle"><span class="tableIdx">{{$t('tableTxt')+(idx+1)+"."}}</span><span>{{$t(table.nameKey)}}</span></div>
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
                :items="renameKeys( table.fieldslang[$t('langCode')],table.items  )"
                :fields="table.fieldslang[$t('langCode')].values"
                :head-variant="null"
                :table-variant="'light'"
                :responsive="true"
            ></b-table>
          </div>
          <v-divider></v-divider>
          <div class="subPanel" v-for="(figure, idx) in figures">
            <div class="tableTitle"><span class="tableIdx">{{$t('figureTxt')+(idx+1)+"."}}</span><span>{{$t(figure.nameKey)}}</span></div>
            <rangeBarchart v-if="figure.type === 'range'" :id="'svg-'+idx" style="height: 40vh" :colors="colors" :breakdown="figure.breakdown" :category="figure.category" :data="figure.data" :group="true" :labels="siteLabels" autoresize></rangeBarchart>
            <BarChart v-if="figure.type === 'bar'" :id="'svg-'+idx" style="width:100%"  :category="figure.category[0]" :colors="colors"  :data="figure.data" :group="figure.category[1]" :labels="siteLabels" :margin="figure.margin"></BarChart>
            <BarChart v-if="figure.type === 'stackBar'" :id="'svg-'+idx" style="width:100%"  :category="figure.category[0]" :colors="colors"  :data="figure.data" :group="figure.category[1]" :labels="siteLabels" :margin="figure.margin" :stack="figure.stack"></BarChart>
            <LineChart v-if="figure.type==='line'" style="width:100%" :categories = "figure.categories" :dates = "figure.dates" :data = "figure.data" ></LineChart>
          </div>

        </div>
      </v-card>

  </v-container>

</template>

<script>
import BarChart from "@/components/barChart";
import { bus } from "@/main";
import Const from "@/const";
import rangeBarchart from "@/components/rangeBarchart"
import LineChart from "@/components/lineChart"

export default {
  name: "Results",
  components: { BarChart, rangeBarchart, LineChart},
  props:{
    tables: {
      type: Array
    },
    figures:{
      type: Array
    },
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
    renameKeys(keysMap, dataArray){

    let newObjArray =[];
        dataArray.forEach(obj => {
           const keyValues = Object.keys(obj).map(key => {
          const newKey = keysMap[key] || key;
          return { [newKey]: obj[key] };
        });
           newObjArray.push(Object.assign({}, ...keyValues));
        });
 
       return newObjArray ;
    },
    newSearch() {
      bus.$emit('newSearch')
    }
  },
  data(){
    return {
      colors: Const.colors,
      // tables:[
      //   {nameKey: "summary_age_key",
      //       fieldslang:{fr:{site:'site',mean:'moyenne', stdev:'stdev', ci95:'ci95', count:'compte'},
      //                   en:{site:'site',mean:'mean', stdev:'stdev', ci95:'ci95', count:'count'}},
      //       items: [
      //         { site: 'CHUM', mean: 72, stdev: 23, ci95:'20-95', count:1766 },
      //         { site: "MUHC", mean: 75, stdev: 21, ci95:'22-99', count:649},
      //         { site: 'JGH', mean: 70, stdev: 22, ci95:'21-94', count:841 }
      //       ]
      //
      //   },
      //   {nameKey: "summary_gender_key",
      //        fieldslang:{fr:{site:'site',male:'homme', female:'femme', total:'total', mode:'mode'},
      //                   en:{site:'site',male:'male', female:'female', total:'total', mode:'mode'}},
      //       items: [
      //         { site: 'CHUM', male: 972, female: 923, total:1895, mode:'male' },
      //         { site: "MUHC", male: 485, female: 321, total:806, mode:'male'},
      //         { site: 'JGH', male: 622, female: 750, total:1372, mode:'female' }
      //       ]
      //
      //   }
      // ],
      // figures:[
      //   // {
      //   //   name: 'Summary of Patient.age at each site, broken down by Patient.gender',
      //   //   type: 'range',
      //   //   breakdown: true,
      //   //   data: [
      //   //     {site:'101', data:{ female:{ min: 62, max: 82}, male:{ min: 58, max: 82}}},
      //   //     {site:'102', data:{ female:{ min: 60, max: 76}, male:{ min: 62, max: 75}}},
      //   //     {site:'103', data:{ female:{ min: 58, max: 80}, male:{ min: 63, max: 79}}}
      //   //   ]
      //   // },
      //   {
      //     nameKey: 'summary_gender_site_key',
      //     category: [['101','102','103'],['male','female']],
      //     type: 'bar',
      //     breakdown:false,
      //     data:[[67,60],[58,72], [76, 80]]
      //   },
      //   // {
      //   //   name: 'Summary of Patient.age at each site',
      //   //   type: 'range',
      //   //   breakdown: false,
      //   //   data: [
      //   //       {site: '101', min: 62, max: 82},
      //   //       {site:'102', min: 60, max: 76},
      //   //       {site:'103', min: 58, max: 80}
      //   //   ]
      //   // },
      //   {
      //     nameKey: 'summary_age_site_key',
      //     category: [['101','102','103']],
      //     type: 'bar',
      //     breakdown:false,
      //     margin: [['101',65,72],['102',58,62],['103',56,60]],
      //     data:[67,60,58]
      //   },
      //   {
      //     nameKey: 'summary_age_site_key',
      //     category: [['101','102','103','104'],['male','female']],
      //     type: 'bar',
      //     breakdown:true,
      //     margin: [['101',[65,70],[70,75]],['102',[58,62],[73,80]],['103',[55,63],[78,83]], ['104',[65,73],[73,79]]],
      //     data:[[67,60,58,68],[72, 76, 80,76]]
      //   },
      //   {
      //     nameKey: 'summary_deceased_strat_key',
      //     type: 'line',
      //     categories:['CHUM', 'JGH'],
      //     dates:['2020-01-01','2020-01-02','2020-01-03','2020-01-04','2020-01-05','2020-01-06','2020-01-07','2020-01-08','2020-01-09'],
      //     data:[[20,18,16,14,10,10,8,9,6,5],[23,21,19,17,15,13,10,9,8,6]]
      //   }
      //   ],
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
