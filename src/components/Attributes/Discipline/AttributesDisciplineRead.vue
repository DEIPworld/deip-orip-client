<template>
  <div v-if="attribute && attribute.value" class="d-flex flex-wrap align-center text-caption text--secondary">
    <template v-for="(item, index) of domains">
      <router-link
        :key="`link-${index}`"
        class="link text--secondary"
        :to="goToDomain(item._id)"
      >
        {{ item.name }}
      </router-link>
      <div
        v-if="index + 1 < domains.length"
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
  import { getNestedValue } from 'vuetify/lib/util/helpers';
  import { find as deepFind } from 'find-keypath';

  export default {
    name: 'AttributesDomainRead',
    mixins: [attributeRead],
    computed: {
      domainsTree() { return this.$store.getters['Domains/tree'](); },
      domains() {
        return this.attribute.value.map((d) => this.getItemObject(d));
      }
    },
    methods: {
      getItemPath(id) {
        const path = deepFind(this.domainsTree, id);
        path.pop();
        return path;
      },
      getItemObject(id) {
        return getNestedValue(
          this.domainsTree,
          this.getItemPath(id)
        );
      },
      goToDomain(id) {
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
