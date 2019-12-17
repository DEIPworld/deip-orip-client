<template>
    <v-layout column fill-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Research Group Tokens</div>
            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <v-layout row mx-auto class="group-share-max-width">
                    <v-flex xs12>
                        <div>
                            Each research group is assigned its own Research Group Tokens which are distributed among its members and can be used to manage the group and its research activity.
                        </div>
                        <div class="body-2 py-3">Distribute tokens of this group as follows:</div>
                        <v-layout row justify-space-between align-center pt-3 
                            v-for="(member, i) in group.members" :key="i"
                        >
                            <div>
                                <v-avatar size="30px">
                                    <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(30, 30, false)" />
                                    <v-gravatar v-else :email="member.account.name + '@deip.world'" />
                                </v-avatar>
                                <router-link :to="'/user-details' + member.account.name" class="a pl-2">{{ member | fullname }}</router-link>
                            </div>

                            <div>
                                <v-text-field class="width-4 pa-0 rtl"
                                    suffix="%" 
                                    hide-details
                                    v-model="member.stake"
                                    mask="###"
                                ></v-text-field>
                            </div>
                        </v-layout>

                        <div class="text-align-right pt-3">
                            <div class="caption grey--text">
                                <div>Total: <span>{{sum}} %</span></div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </div>
        </v-flex>
        <v-flex flex-grow-0>
          <v-layout row justify-center align-center>
              <v-btn flat small @click.native="prevStep()">
                  <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
              </v-btn>

              <v-btn color="primary" :loading="isLoading" @click.native="finish()" :disabled="sum !== 100 || isLoading">
                  Create group
              </v-btn>
          </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "CreateResearchGroupShare",
        props: {
            group: { type: Object, required: true },
            isLoading:  { type: Boolean, required: true },
        },
        data() { 
            return {
            } 
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
                return this.group.members.reduce(
                    (accum, curr) => accum + parseInt(curr.stake || 0),
                    0
                );
            }
        }
    };
</script>

<style lang="less" scoped>
    .group-share-max-width {
        max-width: 510px;
    }

    .rtl.input-group input {
        text-align: center;
    }
</style>
