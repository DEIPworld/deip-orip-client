<template>
  <component :is="tag" v-if="portal && $ready">
    <template v-if="asText">
      {{ portal.profile.shortName }}
    </template>

    <template v-else>
      <v-chip
        small
        :to="{
        name: 'explore',
        query: {
          rFilter: JSON.stringify({portalIds: [portal.id]})
        }
      }"
      >
        <div class="text-truncate spacer">
          {{ portal.profile.shortName }}
        </div>
      </v-chip>
    </template>
  </component>

</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { portalsListStore } from '@/features/Tenant/store/tenantsListStore';
  import { mapState } from 'vuex';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'PortalBadge',
    components: { DMetaItem },
    mixins: [
      componentStoreFactoryOnce(portalsListStore, 'Portals')
    ],
    props: {
      portalId: {
        type: String,
        default: ''
      },

      asText: {
        type: Boolean,
        default: false
      },

      tag: {
        type: String,
        default: 'div'
      }
    },
    computed: {
      ...mapState({
        portal(state, getters) { return getters['Portals/one'](this.portalId); }
      })
    },
    created() {
      this.loadPortal();
    },

    methods: {
      loadPortal() {
        this.$setReady(false);

        this.$store.dispatch('Portals/get', this.portalId)
          .then(() => {
            this.$setReady();
            this.$emit('ready', this.portal);
          });
      }
    }
  };
</script>
