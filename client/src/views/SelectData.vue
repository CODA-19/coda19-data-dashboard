<template>
<v-container class="mainContainer">
 <h1>Select data</h1>
  <div class="row">
    <div class="col-lg-7 col-md-7">
    <div class="selectData">
          <b-form class="mx-5 my-3" @submit="onSubmit" @reset="onReset" >
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
            <b-button type="submit" pill block variant="success" @click="onSubmit">Select</b-button>
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
      form: {
        query:null,
        type:null,
        variables: []
      }
    };
  },
  components: {
    VueSlider
  },
  methods:{
    onSubmit() {
      //TODO: Send request to server
      this.$http.post('http://localhost:3000/api/summary',{
        query: this.form.query,
        type: this.form.type,
        variables: this.form.variables
      })
          .then(response => response.data)
          .then(data => {bus.$emit('showDashboard', data)})

    },
    onReset() {

    }
  }
}
</script>
