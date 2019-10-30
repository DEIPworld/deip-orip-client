<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Select research disciplines</div>

            <div class="subheading c-mb-4 text-align-center c-mh-auto selected-disciplines discipline-picker">
                {{research.disciplines.map(d => d.label).join("  ·  ")}}
            </div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto full-height overflow-y-auto discipline-picker">
                    <advanced-discipline-picker
                        :preselected="research.disciplines"
                        @select="setDisciplines"
                    ></advanced-discipline-picker>
                </div>

            </div>
        </div>
        
        <div class="legacy-row legacy-justify-center align-center">
            <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
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
