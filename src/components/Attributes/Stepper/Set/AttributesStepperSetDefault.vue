<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <v-select
      v-model="internalValue"

      :label="$$label"
      :items="attribute.valueOptions"

      item-text="title"
      item-value="value"

      hide-details="auto"
      :error-messages="errors"

      :disabled="!$$isEditable"

      outlined
    >
      <template #selection="{ item }">
        <div class="d-flex align-center" style="max-width: 100%">
          <v-avatar :size="20" color="primary" class="white--text text-body-2 font-weight-medium mr-2">
            {{ attribute.valueOptions.indexOf(item) + 1 }}
          </v-avatar>
          <div class="text-body-2 text-truncate">
            {{ item.title }}
          </div>
        </div>
      </template>

      <template #item="{ item, on }">
        <div class="d-flex align-center" v-on="on">
          <v-avatar :size="20" color="primary" class="white--text text-body-2 font-weight-medium mr-2">
            {{ attribute.valueOptions.indexOf(item) + 1 }}
          </v-avatar>
          <div class="text-body-2 text-truncate">
            {{ item.title }}
          </div>
        </div>
      </template>
    </v-select>
  </validation-provider>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesStepperSet',
    mixins: [attributeSet],
    methods: {
      // TODO: check
      onChange(key, value) {
        this.$emit('change', {
          attributeId: key,
          value
        });
      }
    }
  };
</script>
