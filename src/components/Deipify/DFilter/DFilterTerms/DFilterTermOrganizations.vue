<template>
  <d-block
    v-if="organizations.length"
    title="Teams"
    widget="compact"
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
              :key="`organization-filter-${organization._id}`"
              :value="organization._id"
              class="d-block mt-2 mx-0 mb-0"
              :class="internalValue.includes(organization._id) ? 'transparent' : 'grey lighten-4'"
              style="width:100%"
            >
              <v-avatar left>
                <img
                  :src="organization._id | teamLogoSrc(24, 24)"
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
  // TODO: check

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
