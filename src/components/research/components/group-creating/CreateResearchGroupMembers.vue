<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Add Members</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-members-max-width">
                    <div class="col-12">
                        <v-text-field
                            name="groupMembersSearch"
                            label="Search..."
                            single-line
                            append-icon="search"
                        ></v-text-field>

                        <div class="row-nowrap justify-between align-center c-pt-4">
                            <div>
                                <v-avatar size="40px">
                                    <img src="http://deip.world/static/akulik.39060d33.png" alt="User">
                                </v-avatar>
                                <router-link to="/userDetails" class="a c-pl-3">Alex Kulik</router-link>
                            </div>
                            <v-btn flat color="grey" class="ma-0">Cancel</v-btn>
                        </div>

                        <v-divider class="c-mt-4"></v-divider>

                        <div class="row-nowrap justify-between align-center c-pt-4" v-for="i in 4" :key="i">
                            <div>
                                <v-avatar size="40px">
                                    <img src="http://deip.world/static/ybokach.acb12e7e.png" alt="User">
                                </v-avatar>
                                <router-link to="/userDetails" class="a c-pl-3">Yura Bokach</router-link>
                            </div>
                            <v-btn flat color="primary" class="ma-0">+ Invite</v-btn>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchGroupMembers",
        data() { 
            return {} 
        },
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            }
        }
    };
</script>

<style lang="less" scoped>
    .group-members-max-width {
        max-width: 600px;
    }
</style>
