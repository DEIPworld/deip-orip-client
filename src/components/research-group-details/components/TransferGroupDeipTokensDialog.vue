<template>
    <v-dialog v-model="isOpen" persistent transition="scale-transition" max-width="700px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Send group assets</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <page-container>
                <contentbar>
                    <v-form ref="form" v-model="isFormValid" @submit.prevent>
                        <v-text-field label="To" 
                            ref="toUsername"
                            v-model="form.to"
                            :rules="[
                                rules.required,
                                rules.isExist
                            ]"
                            @input="usernameChanged"
                            :loading="isUsernameChecking"
                        ></v-text-field>

                        <v-text-field label="Amount" 
                            v-model="form.amount"
                            :rules="[
                                rules.required,
                                rules.amount
                            ]"
                            :suffix="'DEIP'"
                        ></v-text-field>

                        <v-btn block color="primary" 
                            @click="sendTokens()"
                            :loading="isSending"
                            :disabled="isSending"
                            type="submit"
                        >{{ !group.is_personal ? 'Create proposal' : 'Send' }}</v-btn>
                    </v-form>
                </contentbar>
            </page-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';
    import * as proposalService from './../../../services/ProposalService';

    export default {
        name: "TransferGroupDeipTokensDialog",

        props: {
            isOpen: { required: true, type: Boolean }
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                group: 'researchGroup/group',
            })
        },

        data() { 
            return {
                form: {
                    to: '',
                    amount: ''
                },

                isFormValid: false,
                
                rules: {
                    required: value => !!value || 'This field is required',
                    isExist: value => {
                        return this.isUsernameExist !== false || 'No user with such name';
                    },
                    amount: value => {
                        let formatValidationResult = this.deipTokenValidator(value);

                        if (formatValidationResult !== true) {
                            return formatValidationResult;
                        } else if (parseFloat(value) > this.deipTokenBalance) {
                            return 'Amount is greater than your DEIP Token balance';
                        }
                        
                        return true;
                    }
                },
                
                isUsernameExist: undefined,
                isUsernameChecking: false,
                isSending: false
            }
        },

        methods: {
            close() {
                this.$emit('onClose');
            },

            usernameChanged: _.debounce(
                function() {
                    this.isUsernameExist = undefined;

                    if (this.form.to !== '' && this.form.to !== this.user.username) {
                        this.isUsernameChecking = true;

                        deipRpc.api.getAccountsAsync([this.form.to])
                            .then(res => { this.isUsernameExist = !_.isEmpty(res); })
                            .catch(error => { this.isUsernameExist = false; })
                            .finally(() => {
                                this.isUsernameChecking = false;
                                this.$refs.toUsername.validate();
                            });
                    }
                }, 
                600
            ),

            sendTokens() {
                if (this.$refs.form.validate()) {
                    this.isSending = true;

                    proposalService.createSendFundsProposal(
                        this.group.id,
                        this.form.to,
                        this.toAssetUnits(this.form.amount)
                    )
                        .then(data => {
                            this.$store.dispatch('layout/setSuccess', {
                                message: "Proposal was successfully created"
                            });

                            this.clearForm();
                            this.$store.dispatch('researchGroup/loadResearchGroupProposals', { groupId: this.group.id });

                            setTimeout(() => this.close(), 1500);
                        })
                        .catch(err => {
                            this.$store.dispatch('layout/setError', {
                                message: "Proposal was failed"
                            });
                        })
                        .finally(() => {
                            this.isSending = false;
                        });
                }
            },

            clearForm() {
                this.$refs.form.reset();

                this.form.to = '';
                this.form.amount = '';
            }
        },

        watch: {
            isOpen(newVal, oldVal) {
                if (newVal) {
                    this.clearForm();
                }
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
