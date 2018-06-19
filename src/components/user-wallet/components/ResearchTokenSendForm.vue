<template>
    <v-card>
        <div class="blue lighten-4 c-p-4">
            <div class="uppercase text-align-center half-bold">Send research tokens</div>
        </div>

        <div class="c-p-4">
            <v-form ref="form" v-model="isFormValid" @submit.prevent>
                <!-- TODO: add dropdown with full list of researches -->

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
                    suffix="%"
                    v-model="form.amount"
                    :rules="[
                        rules.required,
                        rules.amount
                    ]"
                ></v-text-field>

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
    import deipRpc from '@deip/deip-rpc';
    import { mapGetters } from 'vuex';

    export default {
        name: "ResearchTokenSendForm",
        props: {
            researchTokenBalance: { required: true, type: Number }
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
                        return value !== this.user.username
                            ? this.isUsernameExist !== false || 'No user with such name'
                            : 'You can\'t send tokens to this user';
                    },
                    amount: value => {
                        if (value.match(this.percentQuantityRegex) === null) {
                            return "Incorrect format";
                        }

                        let number = parseFloat(value);

                        if (number === 0) {
                            return 'Amount should be greater than zero';
                        } else if (number > this.researchTokenBalance) {
                            return 'Amount is greater than research token balance';
                        } else {
                            return true;
                        }
                    },
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
                this.form.amount = '';
            },
            sendTokens() {
                if (this.$refs.form.validate()) {
                    this.isSending = true;

                    deipRpc.broadcast.transferResearchTokensAsync(
                        this.user.privKey,
                        // research_token_id
                        // research_id
                        this.user.username,
                        this.form.to,
                        this.toDeipPercent( this.form.amount )
                    ).then(data => {
                        this.$emit('researchTokensTransfered')
                        this.clearForm();
                        
                        this.$store.dispatch('layout/setSuccess', {
                            message: "Amount of research tokens was successfully sent"
                        });

                        return data;
                    }).catch(err => {
                        this.$store.dispatch('layout/setError', {
                            message: "Transaction was failed"
                        });
                    }).finally(() => {
                        this.isSending = false;
                    });
                }
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        }
    };
</script>

<style lang="less" scoped>
</style>
