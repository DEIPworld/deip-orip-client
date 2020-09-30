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
            Search by technology
          </div>
          <v-form @submit.prevent="goToSearch">
            <v-text-field
              v-model="searchTerm"
              outlined
              hide-details
              label="Find technologies"
              append-icon="search"
              @click:append="goToSearch"
            />
            <div class="text-right">
              <v-btn
                text
                small
                class="px-1"
                color="primary"
                :to="{name: 'ResearchFeed'}"
              >
                Advanced Search
              </v-btn>
            </div>
          </v-form>
        </d-stack>

        <div class="text-center ma-n2">
          <v-chip
            v-for="(item, i) in disciplines"
            :key="`${i}-discipline`"
            class="ma-2"
            outlined
            @click="goToDiscipline(item.external_id)"
          >
            {{ item.label }}
          </v-chip>
        </div>
      </d-stack>

    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import { find as deepFind } from 'find-keypath';

  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';

  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'Landing',
    components: {
      DStack,
      DLayoutSectionMain,
      DLayoutSection
    },
    data() {
      return {
        searchTerm: '',
        disciplines: disciplinesService.getTopLevelNodes()
      };
    },
    methods: {
      goToSearch() {
        const route = { name: 'ResearchFeed' };
        const q = {
          searchTerm: this.searchTerm
        };

        if (this.searchTerm) {
          route.query = {};
          route.query.rFilter = JSON.stringify(q);
        }
        this.$router.push(route);
      },

      goToDiscipline(id) {
        const dAttr = this.$where(
          this.$tenantSettings.researchAttributes,
          {
            blockchainFieldMeta: {
              field: 'disciplines'
            }
          }
        )[0];

        const q = {
          researchAttributes: {
            [dAttr._id]: [id]
          }
        };

        this.$router.push({
          name: 'ResearchFeed',
          query: {
            rFilter: JSON.stringify(q)
          }
        });
      }
    }
  };
</script>
