<template>
  <v-form ref="form" v-model="isValid" @submit="onSubmit">
    <v-sheet
      v-for="(section, index) in schema"
      :key="`section-${index}`"
      class="mb-12"
      tile
      :max-width="maxWidth"
    >
      <!--:class="{'mb-2': index + 1 < schema.length}"-->
      <div v-if="section.title" class="title mb-4">
        {{ section.title }}
      </div>

      <v-row v-if="section.fields && section.fields.length" class="ma-n3">
        <form-generator-field
          v-for="field in section.fields"
          :key="field.name"
          :field="setCommonProps(field)"
          :value="model[field.name] || field.value"
          @upd="onInput"
        />
      </v-row>
    </v-sheet>
    <div v-if="$hasSlot('actions')" class="text-right">
      <slot name="actions" />
    </div>
  </v-form>
</template>

<script>

  import FormGeneratorField from '@/components/ForrmGenerator/FormGeneratorField';
  import merge from 'deepmerge';
  import dotProp from 'dot-prop';
  import * as dotWild from 'dot-wild';
  import deepmerge from 'deepmerge';
  import kindOf from 'kind-of';

  export default {
    name: 'FormGenerator',
    components: { FormGeneratorField },
    props: {
      model: {
        type: Object,
        required: true
      },
      schema: {
        type: Array,
        required: true
      },
      valid: {
        type: Boolean,
        default: false
      },
      comonProps: {
        type: Object,
        default: null
      },
      maxWidth: {
        type: [String, Number],
        default: null
      }
    },
    data() {
      return {
        isValid: false,
      };
    },
    methods: {
      setCommonProps(field) {
        return merge.all([
          {
            props: {
              filled: true,
              hideDetails: 'auto'
            }
          },
          { props: this.comonProps || {} },
          field
        ]);
      },

      onBlur() {
        // console.info("blur")
      },
      onChange() {
        // console.info("change")
      },
      onFocus() {
        // console.info("focus")
      },
      onInput(value, target) {

        const localModel = dotWild.expand({ [target]: value })
        const localModelKey = Object.keys(localModel)[0];
        const localModelValue = localModel[localModelKey];

        let outputValue = localModelValue;

        if(this.model[localModelKey]) {
          if (kindOf(localModelValue) === 'object') {
            outputValue = deepmerge(this.model[localModelKey], localModelValue);
          }
          if (kindOf(localModelValue) === 'array') {
            const index = localModelValue.indexOf(localModelValue.filter(() => true)[0])
            const clone = [...this.model[localModelKey]]
            clone[index] = localModelValue[index];
            outputValue = clone;
          }
        }

        this.$set(this.model, localModelKey, outputValue);
        this.$emit('update:model', this.model);
      },
      onSubmit(e) {
        e.preventDefault();

        this.$emit('submit', this.$refs.form.validate());
      }
    }
  };
</script>

<style scoped>

</style>
