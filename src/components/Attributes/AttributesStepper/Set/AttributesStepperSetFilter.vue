<template>
  <v-chip-group
    v-model="internalValue"
    column
    multiple
    active-class="primary--text"
    class="mt-n4"
  >
    <d-list-expand :active="attribute.valueOptions.length > 4">
      <template #default="{expanded}">
        <template v-for="(item, i) in attribute.valueOptions">
          <v-chip
            v-if="expanded || i < 4"
            :key="`research-attribute-filter-${i}`"
            :value="item.value"
            class="d-block mt-2 mx-0 mb-0"

            style="width:100%"
          >
            <v-avatar left color="primary" class="white--text">
              {{ i + 1 }}
            </v-avatar>
            <div class="text-truncate">
              {{ item.title }}
            </div>
          </v-chip>
        </template>
      </template>
    </d-list-expand>
  </v-chip-group>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'AttributesStepperSetFilter',
    components: {
      DListExpand,
      DBlock
    },
    mixins: [attributeSet]
  };
</script>
