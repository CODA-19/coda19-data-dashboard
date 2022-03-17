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
import '@/plugins/lang/query-builder.en.js'
import {
  ResourceTypes,
  FiltersByDataType,
  AttributesByResourceType,
} from "@CODA-19/coda19-fhir-templates";

export default {
  name: "QueryBuilder",
  props:{
    query:Object,
    id: String,
    resource: String
  },
  methods:{
    getFiltersByResource(resource) {
      const attributes = AttributesByResourceType[resource];
      let filters = [];
      attributes.forEach(attr => {
        filters.push(this.recursiveGetPath(attr, attr.name))
      });
      return filters.flat(Infinity)
    },

    recursiveGetPath(attr, path){
      if(!attr.subpaths){
        return this.setFilterOptionsByType(path, attr)
      }
      else{
        let filters = []
        attr.subpaths.forEach(sub =>{
          filters.push(this.recursiveGetPath(sub, path+"."+sub.name))
        })
        return filters
      }
    },
    setFilterOptionsByType(path, attribute){
      if(attribute.type === "boolean"){
        let filter = {
          id: path,
          type: 'boolean',
          input: 'select',
          values: {
            0: 'false',
            1: 'true',
          },
          operators: ['equal', 'not_equal']
        }
        return filter
      }
      else if(attribute.type === "dateTime"){
        let filter = {
          id: path,
          type: 'string',
          validation: {
            format: /^\d{4}-\d+-\d+$/
          },
          operators: ['less', 'less_or_equal', 'greater', 'greater_or_equal', 'equal', 'not_equal'],
          placeholder: '2021-01-01'
        }
        return filter
      }
      else if(attribute.type === "integer"){
        let filter = {
          id: path,
          type: 'integer',
          operators: ['less', 'less_or_equal', 'greater', 'greater_or_equal', 'equal', 'not_equal']
        }
        return filter
      }
      else if(attribute.type === "decimal"){
        let filter = {
          id: path,
          type: 'double',
          operators: ['less', 'less_or_equal', 'greater', 'greater_or_equal', 'equal', 'not_equal']
        }
        return filter
      }
      else if(attribute.type === "string"){
        let filter = {
          id: path,
          type: 'string',
          operators:['equal', 'not_equal', 'matches']
        }
        return filter
      }
    }
  },
  data(){
    return {

    }
  },
  mounted(){
    
    let _this = this,
     $queryBuilder = $('#'+this.id);

    this.filters = this.getFiltersByResource(this.resource);

    $queryBuilder.queryBuilder(this.option);

    $queryBuilder.on('rulesChanged.queryBuilder', function(){

      const result = $(_this.$refs.queryBuilder).queryBuilder('getRules');

      if (!$.isEmptyObject(result)) {
        bus.$emit('queryUpdate', result)
      }

    })

    $('#builder-widgets').on('afterUpdateRuleValue.queryBuilder', function(e, rule) {
      if (rule.filter.plugin === 'datepicker') {
        rule.$el.find('.rule-value-container input').datepicker('update');
      }
    });
  },
  computed:{
    option(){
      return {
        filters: this.getFiltersByResource(this.resource),
        lang_code: this.$i18n.locale,
        rules: this.query,
        allow_groups: false,
        icons: {
          add_group: 'fas fa-plus-square',
          add_rule: 'fas fa-plus-circle',
          remove_group: 'fas fa-minus-square',
          remove_rule: 'fas fa-trash-alt',
          error: 'fas fa-exclamation-triangle'
        },
        templates: {
          rule: '\
<div id="{{= it.rule_id }}" class="rule-container"> \
  <div class="rule-header"> \
    <div class="btn-group pull-left rule-actions"> \
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
        <i class="{{= it.icons.remove_rule }}"></i> \
      </button> \
    </div> \
  </div> \
  {{? it.settings.display_errors }} \
    <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
  {{?}} \
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</div>',
          group: '\
<div id="{{= it.group_id }}" class="rules-group-container"> \
  <div class="rules-group-header"> \
    <div class="btn-group group-conditions"> \
      {{~ it.conditions: condition }} \
        <label class="btn btn-xs btn-primary"> \
          <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }} \
        </label> \
      {{~}} \
    </div> \
    {{? it.settings.display_errors }} \
      <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
    {{?}} \
  </div> \
  <div class=rules-group-body> \
    <div class=rules-list></div> \
  </div> \
    <div class="center"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }} \
      </button> \
    </div> \
</div>'
        }
      };
    },
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
