<template>
  <d-layout-section class="fill-height">
    <d-layout-section-main class="align-self-center">

      <d-stack :gap="48">
        <d-stack
          :gap="16"
          :max-width="580"
          width="100%"
          class="mx-auto"
        >
          <div class="text-h5">
            {{ $t('landing.searchByTech') }}
          </div>
          <v-form @submit.prevent="goToSearch">
            <v-text-field
              v-model="searchTerm"
              outlined
              hide-details
              :label="$t('landing.find')"
              append-icon="search"
              @click:append="goToSearch"
            />
            <div class="text-right">
              <v-btn
                text
                small
                class="px-1"
                color="primary"
                :to="{name: 'explore'}"
              >
                {{ $t('landing.advancedSearch') }}
              </v-btn>
            </div>
          </v-form>
        </d-stack>

        <div class="text-center ma-n2">
          <v-chip
            v-for="(item, i) in domains"
            :key="`${i}-domain`"
            class="ma-2"
            outlined
            @click="goToDomain(item._id)"
          >
            {{ item.name }}
          </v-chip>
        </div>
      </d-stack>

    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'Landing',
    components: {
      DStack,
      DLayoutSectionMain,
      DLayoutSection
    },
    mixins: [attributesChore],
    data() {
      return {
        searchTerm: ''
      };
    },
    computed: {
      domains() { return this.$store.getters['Domains/topLevelList'](); }
    },
    methods: {
      goToSearch() {
        const route = { name: 'explore' };
        const q = {
          searchTerm: this.searchTerm
        };

        if (this.searchTerm) {
          route.query = {};
          route.query.rFilter = JSON.stringify(q);
        }
        this.$router.push(route);
      },

      goToDomain(id) {
        const dAttr = this.$where(
          this.$$projectAttributes,
          {
            blockchainFieldMeta: {
              field: 'domains'
            }
          }
        )[0];

        const q = {
          projectAttributes: {
            [dAttr._id]: [id]
          }
        };

        this.$router.push({
          name: 'explore',
          query: {
            rFilter: JSON.stringify(q)
          }
        });
      }
    }
  };
</script>
