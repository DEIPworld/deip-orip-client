<template>
  <div
    v-if="attribute && attribute.value"
    class="d-flex flex-wrap align-center text-caption text--secondary"
  >
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
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesSelectRead',
    mixins: [attributeRead],
    computed: {
      valueOptions() {
        const val = this.attribute.value;

        return this.attributeInfo.valueOptions
          .filter(({ value }) => val && val.some((v) => v === value));
      }
    },
    methods: {
      goToAttribute(id) {
        const q = {
          projectAttributes: {
            [this.attribute.attributeId]: [id]
          }
        };

        return {
          name: 'explore',
          query: {
            rFilter: JSON.stringify(q)
          }
        };
      }
    }
  };
</script>
