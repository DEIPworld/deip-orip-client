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

      <v-divider class="my-6" />

      <d-block title="Research attributes" small>
        <template v-for="(attribute, index) of tenant.profile.settings.researchAttributes.filter(({ isVisible }) => isVisible)">
          <attributes-set
            :key="`${index}-attr`"
            v-model="research.attributes"
            :attribute-id="attribute._id"
          />
        </template>
      </d-block>


<!--      <v-row-->
<!--        v-for="(item, i) in tenant.profile.settings.researchAttributes"-->
<!--        :key="`${i}-stepper`"-->
<!--        no-gutters-->
<!--        class="my-6"-->
<!--      >-->
<!--        <v-col v-if="item.isVisible" cols="12">-->
<!--          <div class="text-h6 font-weight-medium mb-6">-->
<!--            {{ item.title }}-->
<!--          </div>-->
<!--          <leveller-selector-->
<!--            v-model="research.attributes[i].value"-->
<!--            :items="stepperSelector(item.valueOptions)"-->
<!--            :label="item.title"-->
<!--          />-->
<!--        </v-col>-->
<!--      </v-row>-->

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
  import AttributesSet from '@/components/Attributes/AttributesSet';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'CreateResearchSettings',
    components: {
      DBlock,
      AttributesSet
    },
    props: {
      research: { type: Object, required: true },
      isLoading: { type: Boolean, required: false }
    },
    data() {
      return {
        isPublic: !this.research.is_private,
        attributes: {}
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
    // created() {
    //   const enabledAttributes = this.$store.getters['auth/tenant'].profile.settings.researchAttributes.reduce((acc, item) => {
    //     if (item.isVisible) {
    //       return [...acc, { researchAttributeId: item._id, value: null }]; // set the first entry
    //     }
    //     return [...acc]; // set empty entry
    //   }, []);
    //   this.research.attributes = [...enabledAttributes];
    // },
    methods: {
      stepperSelector(options) {
        return options.map((item, index) => ({
          text: item.title,
          value: item.value,
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
