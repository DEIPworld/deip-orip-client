<template>
    <v-dialog v-model="isShown" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Claim for expertise tokens</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <div class="column-page">
                <div class="content-column">
                    <div class="filling">

                        <div class="headline text-align-center half-bold">Select Disciplines you’re Working With</div>
                        <div class="text-align-center">This is very important for the distribution of the expert tokens</div>

                        <div class="discipline-picker c-mt-8">
                            <advanced-discipline-picker
                                :is-multiple-select="false"
                                :with-recently-used="false"
                                @select="setDiscipline"
                            ></advanced-discipline-picker>
                        </div>

                        <div class="red--text c-pt-2 text-align-center">
                            <v-icon color="red">warning</v-icon>
                            Please be accurate, you’ll need community assistance to change the disciplines
                        </div>

                        <div class="c-pt-6">
                            <v-text-field
                                label="Competently initiate quality experiences through mission-critical vortals" 
                                multi-line auto-grow
                                rows="2"
                            ></v-text-field>
                        </div>

                        <div class="sm-title bold c-pt-6">Add links to your relevant publication in this discipline</div>

                        <v-card class="c-mt-6">
                            <div class="c-p-6">
                                <v-icon color="primary" class="c-mr-3">note_add</v-icon>
                                <span class="primary--text half-bold">Collaboratively envisioneer prospective testing procedures through cross functional processes</span>
                            </div>

                            <v-divider></v-divider>

                            <div class="c-p-6">
                                <v-btn outline icon color="primary" class="ma-0">
                                    <v-icon small>add</v-icon>
                                </v-btn>

                                <span class="deip-blue-color c-pl-3">Add a link to a publication</span>
                            </div>
                        </v-card>
                        
                        <div class="row justify-center c-p-6">
                            <v-btn color="primary">Claim expertise</v-btn>
                        </div>
                    </div>
                </div>
            </div>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "UserClaimExpertiseDialog",
        props: {
            isShown: { type: Boolean, required: true }
        },
        data() {
            return {
            }
        },
        methods: {
            setDiscipline(discipline) {
                console.log(discipline);
            }
        },
        watch: {
        }
    };
</script>

<style lang="less" scoped>
    .discipline-picker {
        height: 350px;
    }
</style>
