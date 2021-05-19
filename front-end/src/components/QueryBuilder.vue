<template>
<div class="col-12" ref="queryBuilder" :id="id"></div>
</template>

<script>
import $ from 'jquery'
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import 'jQuery-QueryBuilder'
import { bus } from "@/main"
import '@/plugins/lang/query-builder.fr.js'

export default {
  name: "QueryBuilder",
  props:{
    query:Object,
    id: String,
    filters: Array
  },
  data(){
    return {

    }
  },
  mounted(){
    let _this = this,
     $queryBuilder = $('#'+this.id);

    $queryBuilder.queryBuilder(this.option);

    $queryBuilder.on('rulesChanged.queryBuilder', function(){

      const result = $(_this.$refs.queryBuilder).queryBuilder('getRules');

      if (!$.isEmptyObject(result)) {
        bus.$emit('queryUpdate', result)
      }

    })
  },
  computed:{
    option(){
      return {
        // regional : {
        //   'fr': {
        //     "__locale": "Fran�ais (fr)",
        //     "add_rule": "Ajouter une r�gle",
        //     "add_group": "Ajouter un groupe",
        //     "delete_rule": "effacer",
        //     "delete_group": "effacer",
        //     "conditions": {
        //       "AND": "ET",
        //       "OR": "OU"
        //     },
        //     "operators": {
        //       "equal": "�gual",
        //       "not_equal": "non �gal",
        //       "in": "dans",
        //       "not_in": "pas dans",
        //       "less": "moins",
        //       "less_or_equal": "moins ou �gal",
        //       "greater": "plus grand",
        //       "greater_or_equal": "plus grand ou �gal",
        //       "between": "entre",
        //       "not_between": "pas entre",
        //       "begins_with": "commence avec",
        //       "not_begins_with": "ne commance pas avec",
        //       "contains": "contiens",
        //       "not_contains": "ne contiens pas",
        //       "ends_with": "se termine avec ",
        //       "not_ends_with": "ne termine pas avec",
        //       "is_empty": "est vide",
        //       "is_not_empty": "n'est pas vide",
        //       "is_null": "est null",
        //       "is_not_null": "n'est pas null"
        //     },
        //     "errors": {
        //       "no_filter": "Aucun filtre s�lectionn�",
        //       "empty_group": "Le groupe est vide",
        //       "radio_empty": "Aucune valeur s�lectionn�e",
        //       "checkbox_empty": "Aucune valeur s�lectionn�e",
        //       "select_empty": "Aucune valeur s�lectionn�e",
        //       "string_empty": "valeur vide",
        //       "string_exceed_min_length": "Doit coontenir au moins {0} caract�res",
        //       "string_exceed_max_length": "Doit coontenir plus de {0} caract�res",
        //       "string_invalid_format": "Format invalide ({0})",
        //       "number_nan": "pas un nombre",
        //       "number_not_integer": "Pas un entier",
        //       "number_not_double": "Pas un nombre r�el",
        //       "number_exceed_min": "Doit �tre plus grand que {0}",
        //       "number_exceed_max": "Doit �tre plus petit que {0}",
        //       "number_wrong_step": "Doit �tre un multiple de {0}",
        //       "number_between_invalid": "Valeure non valide, {0} est plus grand que {1}",
        //       "datetime_empty": "VAleure vide",
        //       "datetime_invalid": "Format de date invalide ({0})",
        //       "datetime_exceed_min": "Doit �tre apr�s {0}",
        //       "datetime_exceed_max": "Doit �tre avant {0}",
        //       "datetime_between_invalid": "Valeures invalides, {0} est plus grand que {1}",
        //       "boolean_not_valid": "Pas une valeure bool�enne",
        //       "operator_not_multiple": "Operator \"{1}\" Ne peut accecpter des valeures multiples"
        //     },
        //     "invert": "Inversser",
        //     "NOT": "NON"
        //   }
        // },
        filters: [{
          id: 'name',
          label: this.$t("QB_name"),
          type: 'string'
        }, {
          id: 'category',
          label: this.$t("QB_category"),
          type: 'integer',
          input: 'select',
          values: {
            1: 'Books',
            2: 'Movies',
            3: 'Music',
            4: 'Tools',
            5: 'Goodies',
            6: 'Clothes'
          },
          operators: ['more', 'equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
        },{
          id: 'deceased',
          label: this.$t("QB_deceased"),
          type: 'integer',
          input: 'select',
          values: {
            0: 'false',
            1: 'true',
          },
          operators: ['equal', 'not_equal', 'is_null', 'is_not_null']
        },{
          id: 'deceased_date',
          label: this.$t("QB_deceased_date"),
          type: 'string',
          operators: ['less', 'less_or_equal', 'greater', 'greater_or_equal', 'is_not_null'],
          validation: {
            format: /^\d{4}-\d+-\d+$/
          },
          placeholder: '2021-01-01'
        },{
          id: 'sex',
          label: this.$t("QB_sex"),
          type: 'integer',
          input: 'select',
          values: {
            1: 'female',
          },
          operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
        },{
          id: 'age',
          label: this.$t("QB_age"),
          type: 'double',
          validation: {
            min: 0,
            step: 0.01
          },
          operators: ['greater', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
        }, {
          id: 'in_stock',
          label:   this.$t("QB_in_stock") ,
          type: 'integer',
          input: 'radio',
          values: {
            1: this.$t("QB_yes"),
            0: this.$t("QB_no")
          },
          operators: ['equal']
        }, {
          id: 'price',
          label:  this.$t("QB_price"),
          type: 'double',
          validation: {
            min: 0,
            step: 0.01
          }
        }, {
          id: 'id',
          label:  this.$t("QB_identifier"),
          type: 'string',
          placeholder: '____-____-____',
          operators: ['equal', 'not_equal'],
          validation: {
            format: /^.{4}-.{4}-.{4}$/
          }
        }],

        rules: this.query,

        icons: {
          add_group: 'fas fa-plus-square',
          add_rule: 'fas fa-plus-circle',
          remove_group: 'fas fa-minus-square',
          remove_rule: 'fas fa-minus-circle',
          error: 'fas fa-exclamation-triangle'
        }
      };
    }
  },
  watch:{
    option(newVal){

      const $b = $('#'+this.id),
          lang = this.$i18n.locale,
          _this = this;

      $b.off('rulesChanged.queryBuilder');

      const rules = $b.queryBuilder('getRules');
      if (!$.isEmptyObject(rules)) {
        newVal.rules = rules;
      } else {
        delete newVal.rules;
      }

      newVal.lang_code = lang;
      $b.queryBuilder('destroy');
      $b.queryBuilder(newVal);

      $b.on('rulesChanged.queryBuilder', function(){
        const result = $(_this.$refs.queryBuilder).queryBuilder('getRules');

        if (!$.isEmptyObject(result)) {
          bus.$emit('queryUpdate', result)
        }
      })

    }
  }
}

</script>

<style scoped>

</style>
