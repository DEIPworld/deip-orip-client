<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="headline text-center mb-3">
        Select domain
      </div>

      <div class="subtitle-1 text-center mx-auto selected-disciplines discipline-picker">
        {{ research.disciplines.map(d => d.label).join(' · ') }}
      </div>

      <div class="pt-2">
        <div class="overflow-y-auto discipline-picker">
          <advanced-discipline-picker style="max-height: 400px"
            :preselected="research.disciplines"
            @select="setDisciplines"
          />
        </div>
      </div>

      <div class="text-center py-4">
        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>

  export default {
    name: 'CreateResearchPickDiscipline',

    props: {
      research: {
        type: Object,
        required: true
      }
    },

    computed: {
      nextDisabled() {
        return !this.research.disciplines.length;
      }
    },

    methods: {
      setDisciplines(disciplines) {
        this.$emit('setDisciplines', disciplines);
      },
      nextStep() {
        this.$emit('incStep');
      }
    }
  };
</script>

<style lang="less" scoped>
  .selected-disciplines {
    min-height: 25px
  }

  .discipline-picker {
    max-width: 1000px;
  }
</style>
