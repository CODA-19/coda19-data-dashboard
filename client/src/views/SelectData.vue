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
                  v-model="form.id"
                  required
                  placeholder="Query"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-selectData2">
              <b-form-input
                  id="input-selectData2"
                  v-model="form.passwd"
                  type="password"
                  required
                  placeholder="Type"
              ></b-form-input>
            </b-form-group>
             <b-form-group id="input-group-selectData3">
                  <b-form-select v-model="selected" :options="options"  ></b-form-select>
            </b-form-group>
            <b-form-group id="input-group-selectData4">
              Days of selection from now <vue-slider v-model="value" :enable-cross="false"></vue-slider>
            </b-form-group>
            <b-button type="submit" pill block variant="success" @click="onSubmit">Select</b-button>
          </b-form>
        </div>

      </div>
           <div class="col-lg-5 col-md-5">
            <div class="connectedPanel">
           <h3>Connected repositories</h3>
           <hr/>
           <ul>
                <li>Centre Hospitalier de l'Universit&eacute; de Montr&eacute;al </li>
                <li>H&ocirc;pital Maisonneuve-Rosemont  </li>
                <li>H&ocirc;pital G&eacute;n&eacute;ral Juif </li>
                <li>Centre Universitaire Sant&eacute; McGill </li>
                <li>H&ocirc;pital Sacr&eacute;-C&oelig;ur de Montr&eacute;al</li>
                <li>Centre Hospitalier Universitaire Sainte-Justine </li>
                <li>Centre Hospitalier Universitaire de Qu&eacute;bec  </li>
                <li>CISSS de Chaudi&egrave;re-Appalaches </li>
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
    value: [0, 30],
    selected: null,
        options: [
          { value: null, text: 'Please select a variable' },
          { value: 'a', text: 'Length of stay' },
          { value: 'b', text: 'ICU' },
          { value: { C: 'CIUSS' }, text: 'Group' },
          { value: 'd', text: 'Age group', disabled: true }
        ],
      form: {
        id:null,
        passwd:null
      }
    };
  },
  components: {
    VueSlider
  },
  methods:{
    onSubmit() {
      //TODO: Send request to server
        bus.$emit('showDashboard')
    },
    onReset() {

    }
  }
}
</script>
