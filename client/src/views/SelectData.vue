<template>
<v-container class="mainContainer">
    <div class="selectData">
    <h1>Select data</h1>
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
            <b-button type="submit" pill block variant="success">Select</b-button>
          </b-form>
        </div>
     </v-container>
</template>

<script>
export default {
  name: "AppHeader",
  data(){
    return {
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
  methods:{
    onSubmit() {
        alert("Not connected");
    },
    onReset() {

    }
  }
}
</script>