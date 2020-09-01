<template>
  <d-layout-section class="fill-height">
    <d-layout-section-main class="align-self-center">
      <v-sheet max-width="580" class="mx-auto mb-12">
        <d-block title="Search by technology">
          <v-form @submit="redirect">
            <v-text-field
              v-model="technologie"
              outlined
              label="Find technologies"
              append-icon="search"
              @click:append="redirect"
            />
          </v-form>
          <div class="text-right">
            <v-btn
              text
              color="primary"
              :to="{name: 'ResearchFeed'}"
            >
              Advanced Search
            </v-btn>
          </div>
        </d-block>
      </v-sheet>
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
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';


  export default {
    name: 'Landing',
    components: {
      DBlock,
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