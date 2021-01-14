<template>
  <v-row>
    <v-col cols="8">
      <v-text-field
        v-model="internalValue.title"
        :label="$t('attributes.nameField', {label: fieldLabelKey})"
        hide-details="auto"
        outlined
      />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="internalValue.shortTitle"
        :label="$t('attributes.shortNameField', {label: fieldLabelKey})"
        hide-details="auto"
        outlined
      />
    </v-col>
    <v-col cols="12">
      <v-textarea
        v-model="internalValue.description"
        :label="$t('attributes.descriptionField', {label: fieldLabelKey})"
        hide-details="auto"
        outlined
        auto-grow
        :rows="3"
      />
    </v-col>
  </v-row>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AttributeEditMeta',
    mixins: [Proxyable],
    props: {
      fieldLabelKey: {
        type: String,
        default() { return this.$t('attributes.fieldLabelKey'); }
      }
    }
  };
</script>
