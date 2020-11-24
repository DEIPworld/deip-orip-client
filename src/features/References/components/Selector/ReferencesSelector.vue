<template>
  <d-autocomplete
    v-model="internalValue"
    :items="references"
    item-text="title"
    item-value="id"
    v-bind="$$fieldProps"
  >
    <template #item="{ item } ">
      {{ item.title }}
    </template>
  </d-autocomplete>
</template>

<script>
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  import { fieldWrapper } from '@/mixins/fieldWrapper';
  import { referencesList } from '@/features/References/mixins';

  export default {
    name: 'ReferencesSelector',
    components: { DAutocomplete },
    mixins: [
      fieldWrapper,
      referencesList
    ]
  };
</script>
