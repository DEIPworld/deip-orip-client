<template>
  <d-autocomplete
    v-model="internalValue"
    label="Select a content to request review"
    hide-details="auto"
    :items="contents"
    item-text="title"
    item-value="_id"
    v-bind="validatableProps"

    :loading="!$ready"
    :disabled="!$ready"
    :menu-props="{
      maxWidth: 370
    }"
  />
</template>

<script>
  import Validatable from 'vuetify/lib/mixins/validatable';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { contentList } from '@/features/Contents/mixins';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'ContentSelector',
    components: { DAutocomplete },
    mixins: [
      contentList,
      Proxyable
    ],
    props: {
      ...Validatable.options.props
    },

    computed: {
      validatableProps() {
        return Object.keys(Validatable.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      },
    }
  };
</script>
