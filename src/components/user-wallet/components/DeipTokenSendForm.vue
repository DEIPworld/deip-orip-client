<template>
    <v-card>
        <div class="blue lighten-4 c-p-4">
            <div class="uppercase text-align-center half-bold">Send deip tokens</div>
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

                <v-text-field
                    label="Memo - optional" 
                    multi-line
                    rows="3"
                    counter="2000"
                    no-resize
                    v-model="form.memo"
                    :rules="[
                        rules.memo
                    ]"
                ></v-text-field>

                <v-text-field label="Amount, DEIP Tokens" 
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
    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex';

    export default {
        name: "DeipTokenSendForm",
        props: {
            deipTokenBalance: { required: true, type: Number }
        },
        data() { 
            return {
                form: {
                    to: '',
                    memo: '',
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
                    memo: value => !value || !!value && value.length <= 2000 || 'String should be shorter',
                    amount: value => {
                        if (value.match(this.ASSET_QUANTITY_REGEX) === null) {
                            return "Incorrect format";
                        }

                        let number = parseFloat(value);

                        if (number === 0) {
                            return 'Amount should be greater than zero';
                        } else if (number > this.deipTokenBalance) {
                            return 'Amount is greater than your DEIP token balance';
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
                this.form.memo = '';
                this.form.amount = '';
            },
            sendTokens() {
                if (this.$refs.form.validate()) {
                    this.isSending = true;

                    deipRpc.broadcast.transferAsync(
                        this.user.privKey,
                        this.user.username,
                        this.form.to,
                        this.toAssetUnits( this.form.amount ),
                        this.form.memo
                    ).then(data => {
                        this.$emit('deipTokensTransfered')
                        this.clearForm();
                        
                        this.$store.dispatch('layout/setSuccess', {
                            message: "Amount of DEIP tokens was sent"
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
