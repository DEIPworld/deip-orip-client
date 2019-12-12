<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Select condition/disease</div>

            <div class="subheading c-mb-4 text-align-center c-mh-auto selected-disciplines discipline-picker">
                {{ grantInfo.discipline && grantInfo.discipline.label }}
            </div>

            <div class="legacy-col-grow overflow-y-auto">
                <div class="c-mh-auto full-height overflow-y-auto discipline-picker">
                    <advanced-discipline-picker
                        :preselected="grantInfo.discipline"
                        :is-multiple-select="false"
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
        name: "DisciplineGrantPickDiscipline",

        props: {
            grantInfo: { type: Object, required: true }
        },

        computed: {
            nextDisabled() {
                return !this.grantInfo.discipline;
            }
        },

        methods: {
            setDisciplines(discipline) {
                this.grantInfo.discipline = discipline;
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
