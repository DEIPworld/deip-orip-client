<template>
  <d-block
    v-if="organizations.length"
    title="Organizations"
    sm
  >
    <d-list-expand :active="organizations.length > 4">
      <template #default="{expanded}">
        <v-chip-group
          v-model="internalValue"
          column
          multiple
          active-class="primary--text"
          class="mt-n4"
        >
          <template v-for="(organization, i) in organizations">
            <v-chip
              v-if="expanded || i < 4"
              :key="`organization-filter-${organization.external_id}`"
              :value="organization.external_id"
              class="d-block mt-2 mx-0 mb-0"
              :class="internalValue.includes(organization.external_id) ? 'transparent' : 'grey lighten-4'"
              style="width:100%"
            >
              <v-avatar left>
                <img
                  :src="organization.external_id | researchGroupLogoSrc(24, 24)"
                >
              </v-avatar>
              <div class="text-truncate">
                {{ organization.name }}
              </div>
            </v-chip>
          </template>
        </v-chip-group>
      </template>
    </d-list-expand>
  </d-block>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'DFilterTermOrganizations',
    components: {
      DBlock,
      DListExpand
    },
    mixins: [Proxyable],
    computed: {
      organizations() {
        return [...this.$store.getters['feed/organizations']].sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  };
</script>
