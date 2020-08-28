<template>
  <b-navbar id="nav" toggleable="lg" variant="faded" type="light">
    <b-navbar-brand href="#">
      <img alt="Vue logo" src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top">
      CODA - 19
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="navbar-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item >
          <router-link to="/" class="nav-link">Home</router-link>
        </b-nav-item>
        <b-nav-item >
          <router-link to="/about" class="nav-link">About</router-link>
        </b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "AppHeader"
}


</script>
