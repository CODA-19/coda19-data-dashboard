<template>
  <b-navbar id="nav" toggleable="lg" variant="faded" type="light">
<!--    <div>-->
    <b-navbar-brand href="/"  >
      <img alt="Vue logo" src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      CODA - 19
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" class="mr-lg-5" is-nav>
      <b-navbar-nav>
        <b-nav-item >
          <router-link to="/" class="nav-link">{{$t('homeTxt')}}</router-link>
        </b-nav-item>
          <b-nav-item >
          <router-link to="/stats" class="nav-link">{{$t('statsTxt')}}</router-link>
        </b-nav-item>
        <b-nav-item >
          <router-link to="/learning" class="nav-link">{{$t('learningTxt')}}</router-link>
        </b-nav-item>
        <b-nav-item >
          <router-link to="/connections" class="nav-link">{{$t('activeConnectionsTxt')}}</router-link>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>

      <b-navbar-nav right style="flex-direction: row; place-content: flex-end;flex: 1 1 auto;margin-top: 10px;" >
        <b-nav-item >
          <router-link to="/request" class="nav-link">{{$t('requestAccessTxt')}}</router-link>
        </b-nav-item>
      <b-nav-item>
        <b-button variant="info" @click="keycloak.logout()">{{$t('logoutTxt')}}</b-button>
      </b-nav-item>
        <b-nav-item id="langBtn" @click="toggleLocale">{{$t('langTxt')}}</b-nav-item>
      </b-navbar-nav>
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
