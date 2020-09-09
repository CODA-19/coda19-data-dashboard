<template>
  <b-navbar id="nav" toggleable="lg" variant="faded" type="light">
    <b-navbar-brand href="#">
      <img alt="Vue logo" src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      CODA - 19
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" class="mr-lg-5" is-nav>
      <b-navbar-nav>
        <b-nav-item >
          <router-link to="/" class="nav-link">Home</router-link>
        </b-nav-item>
          <b-nav-item >
          <router-link to="/selectData" class="nav-link">Select Data</router-link>
        </b-nav-item>
        <b-nav-item >
          <router-link to="/about" class="nav-link">About</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav>
<!--        <b-nav-item href="" class="btn btn-default btn-rounded" data-toggle="modal" data-target="#modalLoginForm">Access Data</b-nav-item>-->
        <b-button variant="info" @click="showModal" v-b-modal.login-panel>Access Data</b-button>

        <b-modal id="login-panel" ref="modal" centered title="Sign in" hide-footer >
          <b-form class="mx-5 my-3" @submit="onSubmit" @reset="onReset" >
            <b-form-group id="input-group-1"  >
              <b-form-input
                  id="input-1"
                  v-model="id"
                  required
                  placeholder="user ID"
                  ref="userID"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2">
<!--                description="We'll never share your email with anyone else."-->

              <b-form-input
                  id="input-2"
                  v-model="passwd"
                  type="password"
                  required
                  placeholder="password"
                  ref="password"
              ></b-form-input>
            </b-form-group>


            <b-button type="submit" pill block variant="success"
                      @click="onSubmit">Login</b-button>
          </b-form>
<!--          <b-card class="mt-3" header="Form Data Result">-->
<!--            <pre class="m-0">{{ form }}</pre>-->
<!--          </b-card>-->
        </b-modal>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import $ from "jquery"

export default {
  name: "AppHeader",
  mounted(){
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      console.log('Modal is about to be closed', bvEvent, modalId)
      this.id = null;
      this.passwd = null;
    })
  },
  data(){
    return {
        id:null,
        passwd:null,
        modalShow: false
    };
  },
  methods:{
    showModal(){
      this.modalShow = true;
    },
    onSubmit(e) {
      e.preventDefault()
      if (this.passwd.length > 0) {
        this.$http.post('http://localhost:3000/auth/login', {
          id: this.id,
          password: this.passwd
        })
            .then(response => {
              localStorage.setItem('user',JSON.stringify(response.data.id));
              localStorage.setItem('jwt',response.data.token);

              if (localStorage.getItem('jwt') != null){
                this.$emit('loggedIn');
                if(this.$route.params.nextUrl != null){
                  this.$router.push(this.$route.params.nextUrl)
                }
                else{
                  this.$router.push('/dashboard');
                  this.$bvModal.hide('login-panel');
                }
              }
            })
            .catch(function (error) {
              console.error(error.response);
            });
      }

    },
    onReset() {

    }
  }
}


</script>
