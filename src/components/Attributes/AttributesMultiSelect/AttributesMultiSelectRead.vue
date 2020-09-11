<template>
  <div v-if="internalValue">
    <d-block small widget separated :title="internalAttribute.title">
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
  import { commonRead } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesMultiSelectRead',
    components: { DBlock },
    mixins: [commonRead],
    computed: {
      valueOptions() {
        return this.internalAttribute.valueOptions.filter(({ value }) => this.internalValue && this.internalValue.some(v => v === value));
      },
    }
  };
</script>
