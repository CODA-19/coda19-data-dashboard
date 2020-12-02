<template>
  <v-container class="mainContainer">
<!--        <h1>{{ $t("titleTxt") }}</h1>-->
    <div class="row">
    <div class="col-lg-7 col-md-7">
      <b-form  @submit.prevent="onSubmit" @reset="onReset">

          <div class="selectData"> <span>{{ $t('selectVariableTxt') }}</span>

            <multiselect v-model="form.variables"
                         :placeholder="$t('selectVariableTxt')"
                         :options="resourceOptions"
                         label="text"
                         :multiple="true"
                         track-by="value"
                         :clear-on-select="false"
                         :close-on-select="false"
                         :showLabels="false"
            >

              <template slot="clear" slot-scope="variables">
                <div class="multiselect__clear" v-if="form.variables.length" @mousedown.prevent.stop="clearAllVar(variables.search)"></div>
              </template><span slot="noResult">No variable found.</span>

            </multiselect>
          </div>

          <div class="selectData">
            <span>{{ $t("selectHospitalTxt") }}</span>
          <multiselect v-model="conns"
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
              <div class="multiselect__clear" v-if="conns.length" @mousedown.prevent.stop="clearAllSites(sites.search)"></div>
            </template><span slot="noResult">No site found.</span>

          </multiselect>
        </div>

<div class="col-lg-6 col-md-4 submit-btn">
        <b-button type="submit" pill block variant="success">{{$t("selectTxt")}}</b-button>
</div>
      </b-form>
    </div>
    <div class="col-lg-5 col-md-5 ">

                <div class="connectedPanel">
                  <h3>{{ $t("siteTitleTxt") }}</h3>
                  <hr />
                  <ul v-for="conn in connections" v-bind:key="conn.uid">
                    <li class="ok">{{ conn.name }}</li>
                  </ul>
                </div>

    </div>

    </div>
  </v-container>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import { bus } from "@/main";
import _ from "underscore";
import Multiselect from "vue-multiselect";

const nameResource = (res) => `${res.type} > ${res.attribute} (${res.datatype})`;
const idResource = (res) => `${res.type}|${res.attribute}|${res.datatype}`;

export default {
  name: "AppHeader",
  props: [ 'connections', 'resources' ],
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
      this.conns = sites;
      return connOptions
    }
  },
  data() {
    return {
      selected: null,
      conns: [],
      connOptions: [],
      resourceOptions: [],
      allSelected: true,
      indeterminate: false,
      form: {
        query: null,
        variables: [],
      },
      sites: [],
    };
  },
  components: {
    VueSlider,
    Multiselect
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
        conns: this.conns,
        sites: ["CHUM", "MUHC"],
        query: this.form.query,
        variables: ["length_of_stay"],
      };

      console.info("post_data", post_data);

      //TODO: Send request to server
      return this.$http
        .post("http://localhost:3000/api/summary", post_data)
        .then(res => res.data);
    },

    getNSummaryData: async function() {
      const url = `http://localhost:3000/api/nsummary?sites=${encodeURI(this.conns.map(conn=>{return conn.value}))}&var=${encodeURI(this.form.variables.map(conn=>{return conn.value}))}`;
      const dat = await fetch(url).then(res => res.json());
      return dat;
    },

    onSubmit: async function() {
      //console.log('old', await this.getSummaryData());
      const dat = await this.getNSummaryData();
      console.info("res_data", dat);

      bus.$emit("showDashboard", dat);
    },
    onReset() {},
    toggleAll(checked) {
      this.conns = checked ? this.connOptions.map(opt => opt.value) : [];
    },
    clearAllVar () {
      this.form.variables = []
    },
    clearAllSites () {
      this.conns = []
    }
  },
  watch: {
    connections() {
      var sites = this.connections.map(conn => ({ 'text': conn.name, 'value': conn.uid }));
      var group = this.$t("selectAllTxt");
      this.connOptions.push({sites:sites, group:group})
      this.conns = sites;
    },
    resources(newVal, oldVal) {
      this.resourceOptions = this.resources.map(res => ({ 'text': nameResource(res), 'value': idResource(res) }));
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
