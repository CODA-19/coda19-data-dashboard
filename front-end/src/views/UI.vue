<template>
<v-container class="mainContainer">
 <h1>{{ $t('titleTxt')}}</h1>
  <div class="row">
    <div class="col-lg-7 col-md-7">
    <div class="selectData">
          <b-form class="mx-5 my-3" @submit.prevent="onSubmit" @reset="onReset" >
            <b-form-group id="input-group-selectData"  >
              <b-form-input
                  id="input-selectData1"
                  v-model="form.query"

                  placeholder="Query"
              ></b-form-input>
            </b-form-group>
             <b-form-group id="input-group-selectData3">
                   <p>{{$t('selectVariableTxt')}}</p>
                  <b-form-select v-model="form.variables" :options="options"  multiple :select-size="4" ></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-selectData4">
              <p>{{$t('selectDaysTxt')}} </p>
              <vue-slider v-model="value" :enable-cross="false"></vue-slider>
            </b-form-group>
            <b-form-group>

              <b>{{$t('selectHospitalTxt')}}</b><br>
              <b-form-checkbox
                  v-model="allSelected"
                  :indeterminate="indeterminate"
                  aria-describedby="sitesOptions"
                  aria-controls="sitesOptions"
                  @change="toggleAll"
              >
                {{ allSelected ? $t('unselectAllTxt') : $t('selectAllTxt') }}
              </b-form-checkbox>

              <b-form-checkbox-group
                  id="site_checkbox_group"
                  v-model="sites"
                  :options="sitesOptions"
                  name="site"
                  stacked
              ></b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" pill block variant="success">{{$t('selectTxt')}}</b-button>
          </b-form>
        </div>

      </div>
           <div class="col-lg-5 col-md-5">
            <div class="connectedPanel">
           <h3>{{$t('siteTitleTxt')}}</h3>
           <hr/>
           <ul v-for="place in places">
                <li class="ok">{{place}}</li>
           </ul>
            </div>
      </div>
    </div>
     </v-container>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { bus } from "@/main"
import _ from 'underscore'
import GeneralApi from "../api/GeneralApi";


export default {
  name: "AppHeader",
  computed: {
    options() {
      return [
        { value: 'length_of_stay', text: this.$t('length_of_stay') },
        { value: 'icu', text: 'ICU'   },
        { value: { C: 'CIUSS' }, text: 'Group' , disabled: true },
        { value: 'age_groups', text: this.$t('age_groups')}
      ]
    }
  },
  data() {
    return {
      places: ["Centre Hospitalier de l'Université de Montréal", "Hôpital Maisonneuve-Rosemont","Hôpital Général Juif", "Centre Universitaire Santé McGill", "Hôpital Sacré-Coueur de Montréal", "Centre Hospitalier Universitaire Sainte-Justine","Centre Hospitalier Universitaire de Québec", "CISSS de Chaudière-Appalaches"],

      value: [0, 30],
      selected: null,
      sitesOptions:[
        {text:'Centre Hospitalier de l\'Université de Montréal', value:'CHUM'},
        {text:'Hôpital Général Juif', value:'HGJ'},
        {text:'Centre Universitaire Santé McGill', value:"MUHC"},
        {text:'Hôpital Maisonneuve-Rosemont', value: 'HMR'},
        {text:'Hôpital Sacré-Cœur de Montréal', value:'HSCM'},
        {text:'Centre Hospitalier Universitaire de Québec', value: 'CHUQ'},
        {text:'Centre Hospitalier Universitaire Sainte-Justine', value:'CHUSJ'},
        {text:'CISSS de Chaudière-Appalaches', value:'CISSS-CA'},
        {text:'The Ottawa Hospital', value:'OttawaHospital'}
      ],
      allSelected: true,
      indeterminate: false,
      form: {
        query:null,
        variables: [],
      },
      sites: []
    };
  },
  components: {
    VueSlider
  },
  mounted(){
    this.sites = _.map(this.sitesOptions, opt=>{
      return opt.value
    })
  },
  methods:{
    onSubmit() {
      const post_data = {
        sites: this.sites,
        query: this.form.query,
        variables: this.form.variables
      };

      console.info('post_data', post_data);

      //TODO: Send request to server
      GeneralApi.testData(post_data)
          .then(response => response.data)
          .then(data => {
            console.info('res_data', data);

            bus.$emit('showDashboard', data);
          })

    },
    onReset() {

    },
    toggleAll(checked) {
      this.sites = checked ? this.sitesOptions.map(option=>{return option.value}).slice() : []
    }
  },
  watch: {
    sites(newVal, oldVal) {
      if (newVal.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newVal.length === this.sitesOptions.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    }
  }
}
</script>
