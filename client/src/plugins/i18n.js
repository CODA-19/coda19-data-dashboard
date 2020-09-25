import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
  'en': {
    titleTxt: "Select data",
    langTxt: "Fr",
    logoutTxt: "logout",
    siteTitleTxt: "Connected repositories",
    selectVariableTxt: "Please select a variable: ",
    length_of_stay: "Length of stay",
    age_groups: "Age groups",
    selectDaysTxt: "Days of selection from now",
    selectHospitalTxt: "Select hospitals to include: ",
    selectTxt: "Select"
  },

  'fr': {
    titleTxt: "Sélectionnez des données",
    langTxt: "En",
    logoutTxt: "Se déconnecter",
    siteTitleTxt: "Dépôts connectés",
    selectVariableTxt: "Veuillez sélectionner une variable: ",
    length_of_stay: "Durée du séjour",
    age_groups: "Les groupes d'âge",
    selectDaysTxt: "Jours de sélection à partir de maintenant",
    selectHospitalTxt: "Sélectionnez les hôpitaux à inclure: ",
    selectTxt: "Sélectionner"
  }};

const i18n = new VueI18n({locale: 'en',  fallbackLocale: 'fr',  messages});

export default i18n;
