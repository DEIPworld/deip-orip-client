<template>
  <d-autocomplete
    v-model="internalValue"
    :items="referencesList"
    item-text="title"
    item-value="_id"
    v-bind="$$fieldProps"
    :filter="filterSelector"

    :loading="!$ready"
    :disabled="!$ready"
  >
    <template #item="{ item } ">
      <div class="py-2 text-body-2">
        {{ item.title }}
      </div>
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
