<template>
<v-container class="mainContainer">
 <h1>Select data</h1>
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
            <b-form-group id="input-group-selectData2">
              <b-form-input
                  id="input-selectData2"
                  v-model="form.type"

                  placeholder="Type"
              ></b-form-input>
            </b-form-group>
             <b-form-group id="input-group-selectData3">
                   <p>Please select a variable</p>
                  <b-form-select v-model="form.variables" :options="options"  multiple :select-size="4" ></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-selectData4">
              <p>Days of selection from now </p>
              <vue-slider v-model="value" :enable-cross="false"></vue-slider>
            </b-form-group>
            <b-form-group>

              <b>Select hospitals to include:</b><br>
              <b-form-checkbox
                  v-model="allSelected"
                  :indeterminate="indeterminate"
                  aria-describedby="sitesOptions"
                  aria-controls="sitesOptions"
                  @change="toggleAll"
              >
                {{ allSelected ? 'Un-select All' : 'Select All' }}
              </b-form-checkbox>

              <b-form-checkbox-group
                  id="site_checkbox_group"
                  v-model="sites"
                  :options="sitesOptions"
                  name="site"
                  stacked
              ></b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" pill block variant="success">Select</b-button>
          </b-form>
        </div>

      </div>
           <div class="col-lg-5 col-md-5">
            <div class="connectedPanel">
           <h3>Connected repositories</h3>
           <hr/>
           <ul v-for="place in places">
                <li>{{place}}</li>
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

export default {
  name: "AppHeader",
  data(){
    return {
    places: ["Centre Hospitalier de l'Université; de Montréal", "Hôpital Maisonneuve-Rosemont","Hôpital Général Juif", "Centre Universitaire Santé McGill", "Hôpital Sacré-Coueur de Montréal", "Centre Hospitalier Universitaire Sainte-Justine","Centre Hospitalier Universitaire de Québec", "CISSS de Chaudière-Appalaches"],
    value: [0, 30],
    selected: null,
        options: [
          { value: 'length_of_stay', text: 'Length of stay' },
          { value: 'icu', text: 'ICU'   },
          { value: { C: 'CIUSS' }, text: 'Group' , disabled: true },
          { value: 'age_groups', text: 'Age groups'}
        ],
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
      allSelected: false,
      indeterminate: false,
      form: {
        query:null,
        type:null,
        variables: [],
      },
      sites: []
    };
  },
  components: {
    VueSlider
  },
  methods:{
    onSubmit() {
      //TODO: Send request to server
      this.$http.post('http://localhost:3000/api/summary',{
        sites: this.sites,
        query: this.form.query,
        type: this.form.type,
        variables: this.form.variables
      })
          .then(response => response.data)
          .then(data => {bus.$emit('showDashboard', data)})

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
