<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Select disciplines your research is related</div>
            <div class="sm-title bold c-mb-4 text-align-center">Please select discipline</div>

            <div class="subheading c-mb-4 text-align-center c-mh-auto selected-disciplines discipline-picker">
                {{ grantInfo.discipline && grantInfo.discipline.label }}
            </div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height overflow-y-auto discipline-picker">
                    <advanced-discipline-picker
                        :is-multiple-select="false"
                        @select="setDisciplines"
                    ></advanced-discipline-picker>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
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
