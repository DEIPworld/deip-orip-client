<template>
  <v-row no-gutters justify="center">
    <v-col cols="7">
      <div class="text-h5 text-center mb-3">
        Project settings
      </div>

      <div class="text-h6 text-align-left mb-3">
        Visibility
      </div>

      <div>
        <div class="display-inline-block" :class="{'grey--text':isPublic}">
          Private project
        </div>
        <div class="display-inline-block">
          <v-switch
            v-model="isPublic"
            class="my-0 ml-2 py-0"
            color="primary"
            @change="setPrivateFlag"
          />
        </div>
        <div class="display-inline-block" :class="{'grey--text':!isPublic}">
          Public project
        </div>
      </div>

      <v-divider />

      <v-row
        v-for="(item, i) in tenant.profile.settings.researchComponents"
        :key="`${i}-stepper`"
        no-gutters
        class="my-6"
      >
        <v-col v-if="item.isVisible" cols="12">
          <div class="text-h6 font-weight-medium mb-6">
            {{ item.component.readinessLevelTitle }}
          </div>
          <leveller-selector
            v-model.number="research.tenantCriterias[i].value.index"
            :items="stepperSelector(item.component.readinessLevels)"
            :label="item.component.readinessLevelTitle"
          />
        </v-col>
      </v-row>

      <div>
        <div class="text-h6 mb-3">
          Partners
        </div>
        <research-partners :partners="research.partners" />
      </div>

      <div class="py-4 text-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>Back
        </v-btn>
        <v-btn
          :loading="isLoading"
          :disabled="isLoading || isEmptyFields"
          color="primary"
          @click.native="nextStep()"
        >
          Create project
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex';
  import LevellerSelector from '@/components/Leveller/LevellerSelector';

  export default {
    name: 'CreateResearchSettings',
    components: {
      LevellerSelector
    },
    props: {
      research: { type: Object, required: true },
      isLoading: { type: Boolean, required: false }
    },
    data() {
      return {
        isPublic: !this.research.isPrivate,
        tenantCriterias: []
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      }),
      isEmptyFields() {
        return this.research.partners.length ? !!this.research.partners.find((item) => item.title == '' || item.type == '') : false;
      }
    },
    created() {
      const enabledCriterias = this.$store.getters['auth/tenant'].profile.settings.researchComponents.reduce((acc, item) => {
        if (item.isVisible) {
          return [...acc, { component: item._id, value: { index: 0 } }]; // set the first entry
        }
        return [...acc, { component: item._id, value: { index: null } }]; // set empty entry
      }, []);

      this.research.tenantCriterias.push(...enabledCriterias);
    },
    methods: {
      stepperSelector(readinessLevels) {
        return readinessLevels.map((item, index) => ({
          text: item.title,
          value: index,
          num: index + 1
        }));
      },
      nextStep() {
        this.$emit('finish');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setPrivateFlag() {
        this.$emit('setPrivateFlag', this.isPublic);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
