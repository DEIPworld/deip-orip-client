<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Group description</div>
            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <v-layout row mx-auto class="group-description-max-width">
                    <v-flex xs12>
                        <v-textarea name="Description"
                            label="Description"
                            solo
                            auto-grow
                            v-model="description"
                            :rules="descriptionRules"
                        ></v-textarea>
                    </v-flex>
                </v-layout>

            </div>
        </v-flex>
        <v-flex flex-grow-0>
          <v-layout row justify-center align-center>
              <v-btn flat small @click.native="prevStep()">
                  <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
              </v-btn>
              <v-btn color="primary" @click.native="nextStep()" :disabled="nextDisabled">Next</v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "CreateResearchGroupDescription",
        props: {
            group: {type: Object, required: true }
        },
        data() { 
            return {
                description: "",
                descriptionRules: [ v => !!v || 'Group description is required' ],
            } 
        },
        computed: {
            nextDisabled(){
                return !this.group.description;
            }
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            }
        },
        watch: {
            description() {
                this.$emit('setDescription', this.description);
            }
        }
    };
</script>

<style lang="less" scoped>
    .group-description-max-width {
        max-width: 700px ;
    }
</style>
