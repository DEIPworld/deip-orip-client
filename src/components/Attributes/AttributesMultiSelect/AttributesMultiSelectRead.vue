<template>
  <div v-if="attribute && attribute.value">
    <d-block small widget separated :title="attribute.title">
      <template v-for="(item, index) of valueOptions">
        <router-link
          class="link text--secondary text-caption"
          :to="{
            name: 'ResearchFeed'
          }"
        >
          {{ item.title }}
        </router-link>
      </template>

    </d-block>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesMultiSelectRead',
    components: { DBlock },
    mixins: [attributeRead],
    computed: {
      valueOptions() {
        // TODO: check
        return this.attributeInfo.valueOptions.filter(({ value }) => this.attribute.value && this.attribute.value.some(v => v === value));
      },
    }
  };
</script>
