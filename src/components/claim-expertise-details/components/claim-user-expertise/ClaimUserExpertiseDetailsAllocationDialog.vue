<template>
    <v-dialog fullscreen v-model="isShown" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Allocation of Expertise Tokens</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <page-container>
                <contentbar>

                    <div class="headline text-align-center">
                        You are suggesting to supply

                        <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: claimer.account.name }}">
                            {{ claimer | fullname }}
                        </router-link>

                        with Expertise Tokens in "{{ discipline.label }}" discipline
                    </div>

                    <v-form v-model="isFormValid" ref="form" style="margin-top: 50px">
                        <div class="discipline-picker c-mt-8">
                            <v-text-field
                                label="Amount of Expertise Tokens"
                                v-model="amount"
                                :rules="[required, digitRule]"
                            ></v-text-field>
                        </div>

                        <div class="red--text text-align-center">
                            <v-icon color="red">warning</v-icon>
                            Please be accurate, you will need the community assistance to change the disciplines
                        </div>

                        <div class="c-pt-6">
                            <v-textarea
                                label="Provide a cover letter"
                                auto-grow
                                :rows="6"
                                v-model="description"
                                :rules="[required]"
                            ></v-textarea>
                        </div>
                    </v-form>
                    
                    <div class="row justify-center c-p-6">
                        <v-btn color="primary"
                            :disabled="!isFormValid || isLoading"
                            :loading="isLoading"
                            @click="createExpertiseAllocationProposal()"
                        >Create proposal</v-btn>
                    </div>

                </contentbar>
            </page-container>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import { getNodeById } from "./../../../common/disciplines/DisciplineTreeService"; 

    export default {
        name: "ClaimUserExpertiseDetailsAllocationDialog",
        props: {
            isShown: { type: Boolean, required: true },
            claimer: { type: Object, required: true },
            disciplineId: { type: Number, required: true }
        },
        data() {
            return {
                DIGIT_REGEX: /^\d+$/,
                digitRule: value => {
                    return value.match(this.DIGIT_REGEX) === null ? 'Incorrect amount format' : true
                },
                required: value => !!value || 'This field is required',
                isFormValid: false,
                isLoading: false,

                amount: '',
                description: '',
                discipline: getNodeById(this.disciplineId)
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        methods: {
            createExpertiseAllocationProposal() {
                this.isLoading = true;

                deipRpc.broadcast.createExpertiseAllocationProposalAsync(
                    this.user.privKey,
                    this.user.username,
                    this.claimer.account.name,
                    this.disciplineId,
                    parseInt(this.amount),
                    this.description
                ).then(() => {
                    this.$store.dispatch('layout/setSuccess', {
                        message: "Proposal was successfully created"
                    });

                    this.$emit('onCreate');

                    setTimeout(() => this.$emit('close'), 1000);
                }).catch(e => {
                    this.$store.dispatch('layout/setError', {
                        message: "Error occured"
                    });

                    console.log(e);
                }).finally(() => {
                    this.isLoading = false;
                });
            }
        },
        watch: {
            'isShown': function(newValue) {
                if (newValue) {
                    this.$refs.form.reset();

                    this.amount = '';
                    this.description = '';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
