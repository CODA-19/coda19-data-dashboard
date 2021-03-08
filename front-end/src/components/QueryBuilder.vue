<template>
<div class="col-12" ref="queryBuilder" :id="id"></div>
</template>

<script>
import $ from 'jquery'
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import 'jQuery-QueryBuilder'
import { bus } from "@/main"

export default {
  name: "QueryBuilder",
  props:{
    query:{
      type: Object
    },
    rules: {
      type: {
        Object
      }
    },
    id:{
      type: String
    }
  },
  data(){
    return {

    }
  },
  mounted(){
    $('#'+this.id).queryBuilder({
        regional : {
            fr: {
                "__locale": "Français (fr)",
                "add_rule": "Ajouter une règle",
                "add_group": "Ajouter un groupe",
                "delete_rule": "effacer",
                "delete_group": "effacer",
                "conditions": {
                    "AND": "ET",
                    "OR": "OU"
                },
                "operators": {
                    "equal": "égual",
                    "not_equal": "non égal",
                    "in": "dans",
                    "not_in": "pas dans",
                    "less": "moins",
                    "less_or_equal": "moins ou égal",
                    "greater": "plus grand",
                    "greater_or_equal": "plus grand ou égal",
                    "between": "entre",
                    "not_between": "pas entre",
                    "begins_with": "commence avec",
                    "not_begins_with": "ne commance pas avec",
                    "contains": "contiens",
                    "not_contains": "ne contiens pas",
                    "ends_with": "se termine avec ",
                    "not_ends_with": "ne termine pas avec",
                    "is_empty": "est vide",
                    "is_not_empty": "n'est pas vide",
                    "is_null": "est null",
                    "is_not_null": "n'est pas null"
                },
                "errors": {
                    "no_filter": "Aucun filtre sélectionné",
                    "empty_group": "Le groupe est vide",
                    "radio_empty": "Aucune valeur sélectionnée",
                    "checkbox_empty": "Aucune valeur sélectionnée",
                    "select_empty": "Aucune valeur sélectionnée",
                    "string_empty": "valeur vide",
                    "string_exceed_min_length": "Doit coontenir au moins {0} caractères",
                    "string_exceed_max_length": "Doit coontenir plus de {0} caractères",
                    "string_invalid_format": "Format invalide ({0})",
                    "number_nan": "pas un nombre",
                    "number_not_integer": "Pas un entier",
                    "number_not_double": "Pas un nombre réel",
                    "number_exceed_min": "Doit être plus grand que {0}",
                    "number_exceed_max": "Doit être plus petit que {0}",
                    "number_wrong_step": "Doit être un multiple de {0}",
                    "number_between_invalid": "Valeure non valide, {0} est plus grand que {1}",
                    "datetime_empty": "VAleure vide",
                    "datetime_invalid": "Format de date invalide ({0})",
                    "datetime_exceed_min": "Doit être après {0}",
                    "datetime_exceed_max": "Doit être avant {0}",
                    "datetime_between_invalid": "Valeures invalides, {0} est plus grand que {1}",
                    "boolean_not_valid": "Pas une valeure booléenne",
                    "operator_not_multiple": "Operator \"{1}\" Ne peut accecpter des valeures multiples"
                },
                "invert": "Inversser",
                "NOT": "NON"
            }
        },
        // this.$t("length_of_stay") 
      filters: [{
        id: 'name',
        label: 'Name',
        type: 'string'
      }, {
        id: 'category',
        label: 'Category',
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
        operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
      }, {
        id: 'in_stock',
        label: 'In stock',
        type: 'integer',
        input: 'radio',
        values: {
          1: 'Yes',
          0: 'No'
        },
        operators: ['equal']
      }, {
        id: 'price',
        label: 'Price',
        type: 'double',
        validation: {
          min: 0,
          step: 0.01
        }
      }, {
        id: 'id',
        label: 'Identifier',
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
      },

    });

    $(this.$refs.queryBuilder).on('rulesChanged.queryBuilder', function(){

      const result = $(this).queryBuilder('getRules');

      if (!$.isEmptyObject(result)) {
        this.query = result
        bus.$emit('queryUpdate', result)
      }


    })
  },
}


$('#btn-reset').on('click', function() {
  $('#builder-basic').queryBuilder('reset');
});

$('#btn-set').on('click', function() {
  $('#builder-basic').queryBuilder('setRules', rules_basic);
});

$('#btn-get').on('click', function() {
  var result = $('#builder-basic').queryBuilder('getRules');

  if (!$.isEmptyObject(result)) {
    alert(JSON.stringify(result, null, 2));
  }
});
</script>

<style scoped>

</style>
