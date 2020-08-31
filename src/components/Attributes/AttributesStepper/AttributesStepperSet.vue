<template>
  <div>
    <v-select
      v-if="!multiple"
      v-model="internalValue"
      :label="internalAttribute.title"
      :items="internalAttribute.valueOptions"
      item-text="title"
      item-value="value"
      outlined
    >
      <template #selection="{ item }">
        <div class="d-flex align-center">
          <v-avatar :size="20" color="primary" class="white--text text-body-2 font-weight-medium mr-2">
            {{ internalAttribute.valueOptions.indexOf(item) + 1 }}
          </v-avatar>
          <span class="text-body-2">{{ item.title }}</span>
        </div>
      </template>

      <template #item="{ item, on }">
        <div class="d-flex align-center" v-on="on">
          <v-avatar :size="20" color="primary" class="white--text text-body-2 font-weight-medium mr-2">
            {{ internalAttribute.valueOptions.indexOf(item) + 1 }}
          </v-avatar>
          <span class="text-body-2">{{ item.title }}</span>
        </div>
      </template>
    </v-select>

    <d-block
      v-else
      :title="internalAttribute.title"
      widget="compact"
    >
      <v-chip-group
        v-model="internalValue"
        column
        multiple
        active-class="primary--text"
        class="mt-n4"
      >
        <d-list-expand :active="internalAttribute.valueOptions.length > 4">
          <template #default="{expanded}">
            <template v-for="(item, i) in internalAttribute.valueOptions">
              <v-chip
                v-if="expanded || i < 4"
                :key="`research-attribute-filter-${i}`"
                :value="item.value"
                class="d-block mt-2 mx-0 mb-0"

                style="width:100%"
              >
                <!-- :class="internalValue.includes(`${item._id}:${step.value}`) ? 'transparent' : 'grey lighten-4'"-->
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
    </d-block>
  </div>

</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'AttributesStepperSet',
    components: {
      DListExpand,
      DBlock
    },
    mixins: [commonSet],
    methods: {
      onChange(key, value) {
        this.$emit('change', { researchAttributeId: key, value })
      }
    }
  };
</script>
