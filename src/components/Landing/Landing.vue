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
          <v-form @submit="redirect">
            <v-text-field
              v-model="technologie"
              outlined
              hide-details
              label="Find technologies"
              append-icon="search"
              @click:append="redirect"
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
            :to="{name: 'ResearchFeed', query: {disciplineExternal_id: item.id}}"
          >
            {{ item.label }}
          </v-chip>
        </div>
      </d-stack>

    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
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
        technologie: '',
        disciplines: disciplinesService.getTopLevelNodes()
      };
    },
    methods: {
      redirect() {
        const route = { name: 'ResearchFeed', query: {} };
        if (this.technologie) {
          route.query.q = this.technologie;
        }
        this.$router.push(route);
      }
    }
  };
</script>
