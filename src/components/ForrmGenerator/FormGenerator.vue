<template>
  <v-form v-if="schema.length">
    <v-sheet
      v-for="(section, index) in schema"
      :key="`section-${index}`"
      class="mb-6"
      tile
    >
      <div class="title mb-2" v-if="section.title">
        {{ section.title }}
      </div>

      <v-row v-if="section.fields && section.fields.length">
        <form-generator-field
          v-for="field in section.fields"
          :key="field.name"
          :field="setCommonProps(field)"
          :value="model[field.name] || field.value"
          @upd="onInput"
        />
      </v-row>
    </v-sheet>
    <div class="mt-12 text-right">
      <slot name="actions" />
    </div>

  </v-form>
</template>

<script>

  import FormGeneratorField from '@/components/ForrmGenerator/FormGeneratorField';
  import merge from 'deepmerge';

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
      }
    },

    methods: {
      setCommonProps(field) {
        return merge.all([
          {
            props: {
              outlined: true,
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
      onInput(value, fieldName) {
        this.$set(this.model, fieldName, value);
        this.$emit('update:model', this.model);
      },
      onSubmit(e) {
        this.$emit('submit', e);
      }
    }
  };
</script>

<style scoped>

</style>
