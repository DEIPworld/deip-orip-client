<template>
     <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="headline font-weight-regular text-xs-center">Select research disciplines</div>

            <div class="subheading mb-3 text-xs-center mx-auto selected-disciplines discipline-picker">
                {{research.disciplines.map(d => d.label).join("  ·  ")}}
            </div>

            <v-flex flex-basis-0 overflow-y-auto>
                <div class="mx-auto fill-height overflow-y-auto discipline-picker">
                    <advanced-discipline-picker
                        :preselected="research.disciplines"
                        @select="setDisciplines"
                    ></advanced-discipline-picker>
                </div>

            </v-flex>
        </v-flex>
        <v-flex flex-grow-0>
          <v-layout flex-grow-0 row wrap justify-center align-center>
              <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    
    export default {
        name: "CreateResearchPickDiscipline",

        props: {
            research: { type: Object, required: true } 
        },

        computed: {
            nextDisabled(){
                return !this.research.disciplines.length;
            }
        },
        
        methods: {
            setDisciplines(disciplines){
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
