<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Research group share</div>
            <div class="col-grow overflow-y-auto">

                <div class="row c-mh-auto group-share-max-width">
                    <div class="col-12">
                        <div class="subheading c-pv-4">Distribute shares of this group which will...</div>

                        <div class="row-nowrap justify-between align-center c-pt-4" 
                            v-for="(member, i) in groupInfo.members" :key="i"
                        >
                            <div>
                                <v-avatar size="30px">
                                    <v-gravatar :email="member.name+ '@deip.world'" />
                                </v-avatar>
                                <router-link :to="'/user-details' + member.name" class="a c-pl-3">{{ member.name }}</router-link>
                            </div>
                            <div>
                                <v-text-field class="width-4 pa-0 rtl"
                                    suffix="%" 
                                    hide-details
                                    v-model="member.stake"
                                    mask="###"
                                ></v-text-field>
                            </div>
                        </div>
                        <div class="text-align-right c-pt-4">
                            <div class="caption grey--text">
                                <div>Total:</div>
                                <div>{{sum}} %</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            <v-btn color="primary" @click.native="finish()" :disabled="sum !== 100">
                Create group
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateResearchGroupShare",
        props: {
            groupInfo: { required: true }
        },
        data() { 
            return {} 
        },
        methods: {
            finish() {
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            }
        },
        computed: {
            sum() {
                return this.groupInfo.members.reduce(
                    (accum, curr) => accum + parseInt(curr.stake || 0),
                    0
                );
            }
        }
    };
</script>

<style lang="less">
    .group-share-max-width {
        max-width: 600px;
    }

    .rtl.input-group input {
        text-align: center;
    }
</style>
