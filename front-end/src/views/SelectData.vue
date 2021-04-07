<template>
  <v-container v-bind:class="[{ 'slim': minimize },'mainContainer']">
<!--        <h1>{{ $t("titleTxt") }}</h1>-->


      <b-form  v-bind:class="{'inline': minimize}" @submit.prevent="onSubmit" @reset="onReset">

          <div class="selectData">
            <v-card class="selectContainer">
              <div class="panelTitle">
                <span>{{ $t("selectHospitalTxt") }}</span>
              </div>

              <div class="selectionPanel">
                <multiselect v-model="form.sites"
                           :placeholder="$t('selectHospitalTxt')"
                           :options="connectionOptions"
                           group-label="group"
                           group-values="sites"
                           :group-select="true"
                           label="text"
                           :multiple="true"
                           track-by="value"
                           :clear-on-select="false"
                           :close-on-select="false"
                           :showLabels="false"
              >
                <template slot="clear" slot-scope="sites">
                  <div class="multiselect__clear" v-if="form.sites.length" @mousedown.prevent.stop="clearAllSites(sites.search)"></div>
                </template><span slot="noResult">No site found.</span>

              </multiselect>
              </div>
            </v-card>

            <v-card id="selectContinuousContainer" class="selectContainer">
              <div class="panelTitle">
                <span>{{ $t("selectMeasuresTxt") }}</span>
              </div>
              <div class="selectionPanel">
                <div class="subPanel">
                  <span>{{$t("contTxt")}}</span>
                  <multiselect v-model="form.measures.cont[$t('langCode')]"
                               :placeholder="$t('selectContTxt')"
                               :options="contOptions[$t('langCode')]"
                               label="label"
                               track-by="value"
                               :multiple="true"
                               :clear-on-select="false"
                               :close-on-select="false"
                               :showLabels="false"
                  >
                    <template slot="clear" slot-scope="cont">
                      <div class="multiselect__clear" v-if="form.measures.cont[componentKey].length" @mousedown.prevent.stop="clearAllCont(cont.search)"></div>
                    </template><span slot="noResult">No measure found.</span>

                  </multiselect>
                </div>

                <div class="subPanel">
                  <span>{{$t("discTxt")}}</span>
                  <multiselect v-model="form.measures.disc[$t('langCode')]"
                               :placeholder="$t('selectDiscTxt')"
                               :options="discOptions[$t('langCode')]"
                               label="label"
                               track-by="value"
                               :multiple="true"
                               :clear-on-select="false"
                               :close-on-select="false"
                               :showLabels="false"
                  >
                    <template slot="clear" slot-scope="disc">
                      <div class="multiselect__clear" v-if="form.measures.disc[componentKey].length" @mousedown.prevent.stop="clearAllDisc(disc.search)"></div>
                    </template><span slot="noResult">No measure found.</span>

                  </multiselect>
                </div>

              </div>
            </v-card>

            <v-card class="selectContainer">
              <div class="panelTitle">
                <span>{{$t("resourceTxt")}}</span>
              </div>

              <div class="selectionPanel">

                <b-card no-body>
                  <b-tabs card>
                    <b-tab v-for="i in tabs" :key="'dyn-tab-' + i" active>
                      <template #title>
                        {{i}}
                        <a class="closeBtn" @click="removeTab(i)"><i class="fas fa-times"></i></a>
                      </template>

                      <div class="subPanel">
                        <span>{{$t("filters")}}</span>
                        <QueryBuilder :id="i+'-queryBuilder'"  :key="componentKey" :query="form.query"></QueryBuilder>
                      </div>
                      <div class="subPanel">
                        <span>{{$t("fields")}}</span>
                        <multiselect v-model="form.field"
                                     :placeholder="$t('selectFieldTxt')"
                                     :options="fieldOptions[$t('langCode')]"
                                     label="label"
                                     track-by="value"
                                     :multiple="true"
                                     :clear-on-select="false"
                                     :close-on-select="false"
                                     :showLabels="false"
                                     openDirection="below"
                        >
                          <template slot="clear" slot-scope="fields">
                            <div class="multiselect__clear" v-if="form.field.length" @mousedown.prevent.stop="clearAllFields(fields.search)"></div>
                          </template><span slot="noResult">No site found.</span>

                        </multiselect>
                      </div>
                    </b-tab>

                    <!-- New Tab Button (Using tabs-end slot) -->
                    <template #tabs-end>
                      <b-nav-item role="presentation" @click.prevent="newTab" href="#"><strong>{{$t("resources_add")}}</strong></b-nav-item>
                    </template>

                    <!-- Render this if no tabs -->
                    <template #empty>
                      <div class="text-center text-muted">
                        There are no open tabs<br>
                        Open a new tab using the <b>Add (+)</b> button above.
                      </div>
                    </template>


                  </b-tabs>
                </b-card>


              </div>
            </v-card>

            <v-card id="selectBreakdownContainer " class="selectContainer">
              <div class="panelTitle">
                <span>{{ $t("selectBreakdownTxt") }}</span>
              </div>
              <div class="selectBreakdown selectionPanel">
                <p>{{ $t("selectBreakdownByTxt") }}</p>
                <div class="row">
                  <div class="col-lg-4 col-md-4">
                    <div>{{ $t("selectResourceTypeTxt") }}</div>
                    <div>
                      <select>
                        <option :value="patient">{{ $t("selectResourcePatient") }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4">
                    <div>{{ $t("selectResourceAttributeTxt") }}</div>
                    <div>
                      <select>
                        <option :value="age">{{ $t("selectResourceAttributeAge")}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div v-if="form.measures.cont[componentKey].length" class="row">
                    <div class="col-lg-4 col-md-4">
                        <span>{{ $t("breakdownStart") }}</span>
                        <input class="form-control" type="date" id="start_breakdown"></input>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <span>{{ $t("breakdownEnd") }}</span>
                        <input class="form-control" type="date" id="end_breakdown"></input>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <span>{{ $t("breakdownStep") }}</span>
                        <input class="form-control" type="number"  :placeholder="$t('breakdownDays')" id="step_breakdown"></input>
                    </div>
                </div>
            </div>
        </v-card>
    </div>


        <div class="col-lg-6 col-md-4 submit-btn">
                <b-button type="submit" pill block variant="success" :disabled="dataUpdate">{{$t("selectTxt")}}</b-button>
        </div>
      </b-form>

<!--    <div class="col-lg-5 col-md-5 ">-->

<!--                <div class="connectedPanel">-->
<!--                  <h3>{{ $t("siteTitleTxt") }}</h3>-->
<!--                  <hr />-->
<!--                  <div class="row">-->
<!--                  <div class="col-log-6 col-md-6 siteList">-->
<!--                    <ul v-for="conn in connections.slice(0,5)" v-bind:key="conn.uid">-->
<!--                      <li class="ok">{{ conn.name }}</li>-->
<!--                    </ul>-->
<!--                  </div>-->

<!--                  <div class="col-log-6 col-md-6 siteList">-->
<!--                    <ul v-for="conn in connections.slice(5,10)" v-bind:key="conn.uid">-->
<!--                      <li class="ok">{{ conn.name }}</li>-->
<!--                    </ul>-->
<!--                  </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--    </div>-->


  </v-container>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { bus } from "@/main";
import _ from "underscore";
import Multiselect from "vue-multiselect";
import GeneralApi from "../api/GeneralApi";
import QueryBuilder from "@/components/QueryBuilder"

const nameResource = (res) => `${res.type} > ${res.attribute} (${res.datatype})`;
const idResource = (res) => `${res.type}|${res.attribute}|${res.datatype}`;

export default {
  name: "AppHeader",
  props: [ 'connections', 'resources', 'minimize'],
  mounted(){
    bus.$on('queryUpdate',(query)=>{this.getQuery(query)})
  },
   
  computed: {
    options() {
      return [
        { value: "length_of_stay", text: this.$t("length_of_stay") },
        { value: "icu", text: "ICU" },
        { value: { C: "CIUSS" }, text: "Group", disabled: true },
        { value: "age_groups", text: this.$t("age_groups") },
      ];
    },
    connectionOptions(){
      var sites = this.connections.map(conn => ({ 'text': conn.name, 'value': conn.uid }));
      var group = this.$t("selectAllTxt");
      var connOptions = [{sites:sites, group:group}]
      this.form.sites= sites;
      return connOptions
    },
    resourceOptions(){
       return this.resources.map(res => ({ 'text': nameResource(res), 'value': idResource(res) }));
    },
    dataUpdate(){
      return this.form.sites.length === 0 || this.form.variables.length === 0 || _.isEqual(this.form, this.cached);
    }
  },
  data() {
    return {
      lastLang:"",
      selected: null,
      conns: [],
      connOptions: [],
      allSelected: true,
      indeterminate: false,
      patient:"",
      componentKey:this.$i18n.locale,
      age:99,
      form: {
        query:  {
      condition: 'AND',
          rules: [{
        id: 'deceased',
        operator: 'equal',
        value: 1
      }, {
        condition: 'AND',
        rules: [{
          id: 'age',
          operator: 'greater',
          value: 70
        }, {
          id: 'sex',
          operator: 'equal',
          value: 1
        }]
      }]
    },
        variables:[],
        breakdown:{
            resourceType:"",
            resourceAttribute:"",
            period:{
                start:'2021/01/01',
                end:'2021/01/01',
                step:0,
            }
        },
        measures:{
          cont:{
              en:[{label:'count', value:'count'},{label:'mean', value:'mean'},{label:'stdev', value:'stdev'},{label:'ci95', value:'ci95'}],
              fr:[{label:'décompte', value:'count'},{label:'moyenne', value:'mean'},{label:'stdev', value:'stdev'},{label:'ci95', value:'ci95'}]
          },
          disc:{
              en:[{label:'age',value: 'age'},{label:'gender', value: 'gender'}],
              fr:[{label:'age',value: 'age'},{label:'genre', value: 'gender'}]
            }
        },
        sites: [],
        field: []
      },
      cached: {
        variables: [],
        breakdown:[],
        sites: []
      },

      //MockData
      sites: [],
      // query: {
      //   condition: 'AND',
      //   rules: [{
      //     id: 'price',
      //     operator: 'less',
      //     value: 10.25
      //   }, {
      //     condition: 'OR',
      //     rules: [{
      //       id: 'category',
      //       operator: 'equal',
      //       value: 2
      //     }, {
      //       id: 'category',
      //       operator: 'equal',
      //       value: 1
      //     }]
      //   }]
      // },
      fieldOptions:{
          en:[{label:'age',value: 'age'},{label:'gender', value: 'gender'}],
          fr:[{label:'age',value: 'age'},{label:'genre', value: 'gender'}]},
      contOptions:{
          en:[{label:'count', value:'count'},{label:'mean', value:'mean'},{label:'stdev', value:'stdev'},{label:'ci95', value:'ci95'}],
          fr: [{label:'Compte', value:'count'},{label:'Moyenne', value:'mean'},{label:'stdev', value:'stdev'},{label:'ci95', value:'ci95'}]},
      discOptions:{
          en:[{label:'age',value: 'age'},{label:'gender', value: 'gender'}],
          fr:[{label:'age',value: 'age'},{label:'genre', value: 'gender'}]},
      tabCounter:1,
      tabs:['patient']
    };
  },
  components: {
    VueSlider,
    Multiselect,
    QueryBuilder
  },
  methods: {
    getMockedSummaryData: async function() {
      return {
        "summary": {
          "categories": ["mean_age"],
          "data": [
            [[1, "111"], [2, "112"]]
          ],
          "means": [ 1.5 ],
          "ranges": [
            [1, 2]
          ],
          "sites": ["CHUM", "MUHC"],
          "types": ["value", "value", "value", "value", "time", "value"]
        }
      }
    },
    getSummaryData: async function() {
      const post_data = {
        conns: this.form.sites,
        sites: ["CHUM", "MUHC"],
        query: this.form.query,
        breakdown:this.form.breakdown,
        variables: ["length_of_stay"],
      };

      console.info("post_data", post_data);

      //TODO: Send request to server
      return GeneralApi.testData(post_data).then(res => res.data);
    },

    getNSummaryData: async function() {
      this.cached.variables = this.form.variables;
      this.cached.sites = this.form.sites;
      this.cached.breakdown  = this.form.breakdown;
      
      const sitesUri = encodeURI(this.form.sites.map(conn=>{return conn.value}));
      const varUri = encodeURI(this.form.variables.map(conn=>{return conn.value}));
      const breakdownUri = encodeURI(this.form.breakdown.map(conn=>{return conn.value}));
      const data = await GeneralApi.nsummary(sitesUri, varUri, breakdownUri).then(res => res.data);

      return data;
    },

    onSubmit: async function() {
      //console.log('old', await this.getSummaryData());
      const dat = await this.getNSummaryData();
      console.info("res_data", dat);

      bus.$emit("showDashboard", dat);
    },
    onReset() {},
    toggleAll(checked) {
      this.form.sites = checked ? this.connOptions.map(opt => opt.value) : [];
    },
    clearAllVar () {
      this.form.variables = []
    },
    clearAllSites () {
      this.form.sites = []
    },
    clearAllFields (){
      this.form.field = []
    },
    clearAllCont (){
      this.form.measures.cont = []
    },
    clearAllDisc (){
      this.form.measures.disc = []
    },
    getQuery(query){
      this.form.query = query;
    },
    newTab() {
      this.tabs.push(this.tabCounter++)
    },
    removeTab(x){
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.tabs.splice(i, 1)
        }
      }
    }
  },
  watch: {
    connections() {
      var sites = this.connections.map(conn => ({ 'text': conn.name, 'value': conn.uid }));
      var group = this.$t("selectAllTxt");
      this.connOptions.push({sites:sites, group:group})
      this.form.sites = sites;
    },
    conns(newVal, oldVal) {
      if (newVal.length === 0) {
        this.indeterminate = false;
        this.allSelected = false;
      } else if (newVal.length === this.connOptions.length) {
        this.indeterminate = false;
        this.allSelected = true;
      } else {
        this.indeterminate = true;
        this.allSelected = false;
      }
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.multiselect__clear {
  position: absolute;
  right: 41px;
  height: 40px;
  width: 40px;
  display: block;
  cursor: pointer;
  z-index: 2;
}
.multiselect__clear::before {
  transform: rotate(45deg);
}
.multiselect__clear::after {
  transform: rotate(-45deg);
}
.multiselect__clear::after, .multiselect__clear::before {
  content: "";
  display: block;
  position: absolute;
  width: 3px;
  height: 16px;
  background: #aaa;
  top: 12px;
  right: 4px;
}
</style>
