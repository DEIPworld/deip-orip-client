<template>
    <v-card>
        <div class="primary lighten-5 c-p-4">
            <div class="uppercase text-align-center half-bold">Send group assets</div>
        </div>

        <div class="c-p-4">
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
                    suffix="$"
                ></v-text-field>

                <!-- <v-text-field
                    label="Memo - optional" 
                    multi-line
                    rows="3"
                    counter="2000"
                    no-resize
                    v-model="form.memo"
                    :rules="[
                        rules.memo
                    ]"
                ></v-text-field> -->

                <v-btn block color="primary" 
                    @click="sendTokens()"
                    :loading="isSending"
                    :disabled="isSending"
                    type="submit"
                >Send</v-btn>
            </v-form>
        </div>
    </v-card>
</template>

<script>
    import _ from 'lodash';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { mapGetters } from 'vuex';
    import * as proposalService from './../../../services/ProposalService';

    export default {
        name: "RGDeipTokenSendForm",

        props: {
            deipTokenBalance: { required: true, type: Number }
        },

        data() { 
            return {
                form: {
                    to: '',
                    // memo: '',
                    amount: ''
                },

                isFormValid: false,
                
                rules: {
                    required: value => !!value || 'This field is required',
                    isExist: value => {
                        return value !== this.user.username
                            ? this.isUsernameExist !== false || 'No user with such name'
                            : 'You can\'t send tokens to this user';
                    },
                    // memo: value => !value || !!value && value.length <= 2000 || 'String should be shorter',
                    amount: value => {
                        let formatValidationResult = this.deipTokenValidator(value);

                        if (formatValidationResult !== true) {
                            return formatValidationResult;
                        } else if (parseFloat(value) > this.deipTokenBalance) {
                            return 'Amount is greater than group balance';
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
            clearForm() {
                this.$refs.form.reset();

                this.form.to = '';
                // this.form.memo = '';
                this.form.amount = '';
            },
            sendTokens() {
                if (this.$refs.form.validate()) {
                    this.isSending = true;

                    proposalService.createSendFundsProposal(
                        this.group.id,
                        this.form.to,
                        this.toAssetUnits(this.form.amount)
                    )
                        .then(data => {
                            this.clearForm();

                            this.$store.dispatch('layout/setSuccess', {
                                message: "Proposal was successfully created"
                            });

                            return data
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
            }
        },

        computed: {
            ...mapGetters({
                user: 'auth/user',
                group: 'rgWallet/group'
            })
        }
    };
</script>

<style lang="less" scoped>
</style>
