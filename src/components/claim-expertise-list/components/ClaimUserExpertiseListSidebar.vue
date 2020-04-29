<template>
  <div>
    <div class="subtitle-1 c-pb-4 bold">
      Disciplines
    </div>

    <discipline-tree-picker
      :preselected="selectedDisciplines"
      @select="selectDisciplines"
    />
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ClaimUserExpertiseListSidebar',

    data() {
      return {
      };
    },

    computed: {
      ...mapGetters({
        selectedDisciplines: 'claimExpertiseList/selectedDisciplines'
      })
    },

    methods: {
      selectDisciplines(disciplines) {
        this.$store.dispatch('claimExpertiseList/setSelectedDisciplines', disciplines);
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
