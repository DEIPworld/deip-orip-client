<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="text-center headline">
        Add title and description
      </div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto pt-4" style="max-width: 1000px;">
          <v-row no-gutters>
            <v-col cols="6" offset="3">
              <v-textarea
                v-model="title"
                name="title"
                label="Title"
                solo
                @keyup="setTitle"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="6" offset="3">
              <v-textarea
                v-model="description"
                name="Description"
                label="Description"
                placeholder="What problem it solves, how it helps to others, why it is special ?"
                solo
                @keyup="setDescription"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="6" offset="3">
              <v-text-field
                v-model="videoSrc"
                prepend-inner-icon="link"
                label="Link to a video presentation"
                solo
                :rules="[rules.link]"
                @keyup="setVideo"
              />
            </v-col>
          </v-row>

          <!-- <v-row no-gutters>
                        <v-col cols="6" offset="3">
                            <v-checkbox v-model="tmpIsPrivate" label="Choose if group should be private"></v-checkbox>
                        </v-col>
          </v-row>-->

          <!-- <v-row no-gutters>
                        <v-col cols="3" class="pr-4 font-weight-bold subtitle-1">Main goals of your research</v-col>
                        <v-col cols="6">
                            <v-text-field name="goals" label="Goals" solo textarea hide-details></v-text-field>
                        </v-col>
          </v-row>-->
        </div>
      </div>
    </div>

    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>

        <v-btn
          color="primary"
          :disabled="nextDisabled"
          :loading="isLoading"
          @click.native="nextStep()"
        >
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'CreateResearchMeta',
    props: {
      research: {
        type: Object,
        required: true
      },
      isLoading: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        title: '',
        description: '',
        videoSrc: '',
        rules: {
          link: (value) => !value || this.isValidLink || 'Invalid http(s) link'
        },
        tmpIsPrivate: false
      };
    },
    computed: {
      isValidLink() {
        const regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
        return regexp.test(this.videoSrc || '');
      },
      videoSrcIsValidOrAbsent() {
        return !this.videoSrc || this.isValidLink;
      },
      nextDisabled() {
        return (
          !this.research.title
          || !this.research.description
          || !this.videoSrcIsValidOrAbsent
          || this.isLoading
        );
      }
    },
    methods: {
      nextStep() {
        // temporary it is the last step
        // this.$emit('finish');
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setTitle() {
        this.$emit('setTitle', this.title);
      },
      setDescription() {
        this.$emit('setDescription', this.description);
      },
      setVideo() {
        this.$emit('setVideo', this.videoSrc);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
