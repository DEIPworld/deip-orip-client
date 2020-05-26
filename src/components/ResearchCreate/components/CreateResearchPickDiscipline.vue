<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="headline text-center">
        Select research disciplines
      </div>
      <div class="subtitle-1 mb-4 text-center mx-auto selected-disciplines discipline-picker">
        {{ research.disciplines.map(d => d.label).join(' · ') }}
      </div>
      <div class="flex-basis-0 flex overflow-y-auto">
        <div class="mx-auto fill-height overflow-y-auto discipline-picker">
          <advanced-discipline-picker
            :preselected="research.disciplines"
            @select="setDisciplines"
          />
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="flex-grow-0 display-flex justify-center align-center">
        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </div>
  </div>
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
