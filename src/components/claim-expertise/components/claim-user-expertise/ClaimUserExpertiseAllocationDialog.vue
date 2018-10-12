<template>
    <v-dialog v-model="isShown" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Allocation of expertise</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <page-container>
                <contentbar>

                    <div class="headline text-align-center half-bold">
                        You're suggesting to supply <span class="a">William Watkins</span> with expert tokens in 
                    </div>

                    <div class="discipline-picker c-mt-8">
                        <v-text-field
                            label="Amount of expert tokens"
                        ></v-text-field>
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
                    
                    <div class="row justify-center c-p-6">
                        <v-btn color="primary">Create a proposal</v-btn>
                    </div>

                </contentbar>
            </page-container>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "ClaimUserExpertiseAllocationDialog",
        props: {
            isShown: { type: Boolean, required: true }
        },
        data() {
            return {
            }
        },
        methods: {
        },
        watch: {
        }
    };
</script>

<style lang="less" scoped>
</style>
