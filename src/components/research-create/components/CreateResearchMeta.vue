<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Add title and description</div>

            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <div class="mx-auto pt-3" style="max-width: 1000px;">
                    <v-layout row>
                        <v-flex xs6 offset-xs3>
                            <v-textarea v-model="title" v-on:keyup="setTitle" 
                                name="title" label="Title" 
                                solo
                            ></v-textarea>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs6 offset-xs3>
                            <v-textarea v-model="description" v-on:keyup="setDescription" 
                                name="Description" label="Description" placeholder="What problem it solves, how it helps to others, why it is special"
                                solo
                            ></v-textarea>
                        </v-flex>
                    </v-layout>

                    <v-layout row pt-3>
                        <v-flex xs6 offset-xs3>
                            <v-text-field 
                              v-on:keyup="setVideo" 
                              prepend-inner-icon="link"
                              label="Link to a video presentation" 
                              v-model="videoSrc"
                              solo
                              :rules="[rules.link]"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                   <!-- <v-layout row pt-3>
                        <v-flex xs6 offset-xs3 class="">
                            <v-checkbox v-model="tmpIsPrivate" label="Choose if group should be private"></v-checkbox>
                        </v-flex>
                    </v-layout> -->

                   <!-- <v-layout row pt-3>
                        <v-flex xs3 pr-3 font-weight-bold subheading>Main goals of your research</v-flex>
                        <v-flex xs6>
                            <v-text-field name="goals" label="Goals" solo textarea hide-details></v-text-field>
                        </v-flex>
                    </v-layout> -->
                </div>
            </div>

        </v-flex>

        <v-flex flex-grow-0>
          <v-layout row justify-center align-center>
              <v-btn flat small @click.native="prevStep()">
                  <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
              </v-btn>

              <v-btn color="primary"
                  :disabled="nextDisabled"
                  :loading="isLoading"
                  @click.native="nextStep()"
              >Next</v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>

    import { mapGetters } from 'vuex';
    
    export default {
        name: "CreateResearchMeta",
        props: {
            research: { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
        },
        data() { 
            return {
                title: "",
                description: "",
                videoSrc: "",
                rules: {
                  link: (value) => {
                    return (!value || this.isValidLink) || 'Invalid http(s) link';
                  }
                },
                tmpIsPrivate: false
            }
        },
        computed: {
            isValidLink() {
              let regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
              return regexp.test(this.videoSrc || "");
            },
            videoSrcIsValidOrAbsent() {
              return !this.videoSrc || this.isValidLink;
            },
            nextDisabled(){
                return !this.research.title || !this.research.description || !this.videoSrcIsValidOrAbsent || this.isLoading;
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
            },
        }
    };
</script>

<style lang="less" scoped>
</style>
