<template>
  <v-container class="mainContainer">
    <h1>{{ $t("titleTxt") }}</h1>
    <div class="row">
      <div class="col-lg-7 col-md-7">
        <div class="selectData">
          <b-form class="mx-5 my-3" @submit.prevent="onSubmit" @reset="onReset">
            <!--
            <b-form-group id="input-group-selectData">
              <b-form-input
                id="input-selectData1"
                v-model="form.query"
                placeholder="Query"
              ></b-form-input>
            </b-form-group>
            -->
            <b-form-group id="input-group-selectData3">
              <p>{{ $t("selectVariableTxt") }}</p>
              <b-form-select
                v-model="form.variables"
                :options="resourceOptions"
                multiple
                :select-size="8"
              ></b-form-select>
            </b-form-group>
            <b-form-group>
              <b>{{ $t("selectHospitalTxt") }}</b
              ><br />
              <b-form-checkbox
                v-model="allSelected"
                :indeterminate="indeterminate"
                aria-describedby="connOptions"
                aria-controls="connOptions"
                @change="toggleAll"
              >
                {{ allSelected ? $t("unselectAllTxt") : $t("selectAllTxt") }}
              </b-form-checkbox>

              <b-form-checkbox-group
                id="site_checkbox_group"
                v-model="conns"
                :options="connOptions"
                name="conn"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" pill block variant="success">{{
              $t("selectTxt")
            }}</b-button>
          </b-form>
        </div>
      </div>
      <div class="col-lg-5 col-md-5">
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
      const url = `http://localhost:3000/api/nsummary?sites=${encodeURI(this.conns)}&var=${encodeURI(this.form.variables)}`;
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
  },
  watch: {
    connections(newVal, oldVal) {
      this.connOptions = this.connections.map(conn => ({ 'text': conn.name, 'value': conn.uid }));
      this.conns = this.connections.map(conn => conn.uid);
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
