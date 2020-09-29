import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
  'en': {
    //select
    titleTxt: "Select data",
    langTxt: "Fr",
    logoutTxt: "logout",
    siteTitleTxt: "Connected repositories",
    selectVariableTxt: "Please select a variable: ",
    length_of_stay: "Length of stay",
    age_groups: "Age groups",
    selectDaysTxt: "Days of selection from now",
    selectHospitalTxt: "Select hospitals to include: ",
    selectAllTxt: "Select all",
    unselectAllTxt: "Un-select all",
    selectTxt: "Select",

    //dashboard
    newSearchTxt: "New Search",
    summaryTxt: "Summary",
    keyVariablesTxt: "Key Variables",
    legendTxt: "Legend",
    meanTxt: "Mean",
    saveImgTxt: "Save Image",
    tested: "Number Tested",
    positive: "Number Positive",
    admitted: "Number Admitted",
    admission_date: "Median COVID-19 \n Admission Date",
    mean_age: "Mean Age",

    age_0_to_4: "0 to 4 yrs",
    age_5_to_19: "5 to 19 yrs",
    age_20_to_49: "20 to 49 yrs",
    age_50_to_64: "50 to 64 yrs",
    age_65_and_up: "65 and up"
  },

  'fr': {
    //select
    titleTxt: "Sélectionnez des données",
    langTxt: "En",
    logoutTxt: "Se déconnecter",
    siteTitleTxt: "Dépôts connectés",
    selectVariableTxt: "Veuillez sélectionner une variable: ",
    length_of_stay: "Durée du séjour",
    age_groups: "Les groupes d'âge",
    selectDaysTxt: "Jours de sélection à partir de maintenant",
    selectHospitalTxt: "Sélectionnez les hôpitaux à inclure: ",
    selectAllTxt: "Tout sélectionner",
    unselectAllTxt: "Désélectionner tout",
    selectTxt: "Sélectionner",

    //dashboard
    newSearchTxt: "Nouvelle Recherche",
    summaryTxt: "Résumé",
    keyVariablesTxt: "Variables-Clés",
    legendTxt: "Légende",
    meanTxt: "Moyenne",
    saveImgTxt: "Enregistrer l'image",
    tested: "Nombre Testé",
    positive: "Nombre Positif",
    admitted: "Numbre d'Admis",
    admission_date: "Date d'Admission \n Médiane du COVID-19",
    mean_age: "Âge Moyen",

    age_0_to_4: "0 à 4 ans",
    age_5_to_19: "5 à 19 ans",
    age_20_to_49: "20 à 49 ans",
    age_50_to_64: "50 à 64 ans",
    age_65_and_up: "65 et plus"
  }};

const i18n = new VueI18n({locale: 'en',  fallbackLocale: 'fr',  messages});

export default i18n;
