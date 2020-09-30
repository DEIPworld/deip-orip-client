<template>
  <div v-if="attribute && attribute.value" class="d-flex align-center text-caption text--secondary">
    <template v-for="(item, index) of valueOptions">
      <router-link
        :key="`link-${index}`"
        class="link text--secondary"
        :to="goToAttribute(item.value)"
      >
        {{ item.title }}
      </router-link>
      <div
        v-if="index + 1 < valueOptions.length"
        :key="`dot-${index}`"
        class="mx-2"
      >
        •
      </div>
    </template>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesMultiSelectRead',
    mixins: [attributeRead],
    computed: {
      valueOptions() {
        // TODO: check
        return this.attributeInfo.valueOptions.filter(({ value }) => this.attribute.value && this.attribute.value.some((v) => v === value));
      }
    },
    methods: {
      goToAttribute(id) {
        const q = {
          researchAttributes: {
            [this.attribute.researchAttributeId]: [id]
          }
        };

        return {
          name: 'ResearchFeed',
          query: {
            rFilter: JSON.stringify(q)
          }
        };
      }
    }
  };
</script>
