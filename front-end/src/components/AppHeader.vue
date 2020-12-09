<template>
  <b-navbar id="nav" toggleable="lg" variant="faded" type="light">
    <b-navbar-brand href="/"  >
      <img alt="Vue logo" src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      CODA - 19
    </b-navbar-brand>
<!--    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
<!--    <b-collapse id="nav-collapse" class="mr-lg-5" is-nav>-->
      <b-navbar-nav>
<!--        <b-nav-item >-->
<!--          <router-link to="/" class="nav-link">{{$t('homeTxt')}}</router-link>-->
<!--        </b-nav-item>-->
<!--          <b-nav-item >-->
<!--          <router-link to="/selectData" class="nav-link">Select Data</router-link>-->
<!--        </b-nav-item>-->
        <!--<b-nav-item >-->
          <!--<router-link to="/about" class="nav-link">About</router-link>-->
        <!--</b-nav-item>-->
        <b-nav-item >
          <router-link to="/connections" class="nav-link">{{$t('activeConnectionsTxt')}}</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav style="flex-direction: row">
        <b-nav-item >
          <router-link to="/request" class="nav-link">{{$t('requestAccessTxt')}}</router-link>
        </b-nav-item>
      <!--        <b-nav-item href="" class="btn btn-default btn-rounded" data-toggle="modal" data-target="#modalLoginForm">Access Data</b-nav-item>-->
      <b-button variant="info" @click="keycloak.logout()">{{$t('logoutTxt')}}</b-button>
        <b-nav-item id="langBtn" @click="toggleLocale">{{$t('langTxt')}}</b-nav-item>
      </b-navbar-nav>
<!--    </b-collapse>-->
  </b-navbar>
</template>

<script>
export default {
  name: "AppHeader",
  props: ['keycloak'],
  data(){
    return {
      form: {
        id:null,
        passwd:null
      }
    };
  },
  methods:{
    toggleLocale(){
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'fr':'en';
    }
  }
}


</script>
