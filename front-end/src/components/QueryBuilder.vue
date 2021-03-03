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
