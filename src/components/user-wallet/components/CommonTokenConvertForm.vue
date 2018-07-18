<template>
    <v-card>
        <div class="blue lighten-4 c-p-4">
            <div class="uppercase text-align-center half-bold">Convert</div>
        </div>

        <div class="c-p-4">
            <v-form ref="form" @submit.prevent>
                <div class="c-pb-4">
                    <div v-if="isDeipToCommonMode">1 DEIP Token = 1000 DEIP Commons</div>
                    <div v-else>1 DEIP Common = 0.001 DEIP Tokens</div>
                </div>

                <v-text-field ref="amount"
                    :label="isDeipToCommonMode ? 'Amount, DEIP Token' : 'Amount, DEIP Common'" 
                    v-model="amount"
                    :rules="[
                        rules.required,
                        isDeipToCommonMode ? rules.deipTokenAmount : rules.deipCommonAmount
                    ]"
                    :hint="amountInputHint"
                    persistent-hint
                ></v-text-field>

                <div class="align-center justify-space-around c-pv-6" 
                    :class="isDeipToCommonMode ? 'row' : 'row-reverse'"
                >
                    <div class="column width-5">
                        <!-- TODO: make service component which can manage our all SVG items -->
                        <div class="c-m-auto c-mb-1" style="height: 40px; width: 40px;">
                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91431 0H6.15204V1.9375H7.271V0H9.50873V2.01611C10.6616 2.15356 11.725 2.47119 12.6993 2.96875C14.0454 3.64844 15.0944 4.61328 15.8462 5.86328C16.6067 7.10547 16.9913 8.5 17 10.0469V10.832C17 12.3945 16.6285 13.7969 15.8855 15.0391C15.1512 16.2734 14.111 17.2422 12.7648 17.9453C11.767 18.4641 10.6817 18.7915 9.50873 18.9275V21H7.271V19H6.15204V21H3.91431V19H0V1.9375H3.91431V0ZM4 5.11328V15.8359H8.2019C9.52185 15.8359 10.5358 15.418 11.2439 14.582C11.9519 13.7383 12.306 12.4883 12.306 10.832V10.0938C12.306 8.44531 11.9519 7.20312 11.2439 6.36719C10.5358 5.53125 9.50439 5.11328 8.14948 5.11328H4Z" transform="translate(13 9)" fill="#F0F1F4"/>
                            </svg>
                        </div>

                        <div class="c-m-auto caption grey--text">DEIP token</div>
                    </div>

                    <v-btn large flat icon class="ma-0" color="primary" @click="changeMode()">
                        <v-icon large>swap_horiz</v-icon>
                    </v-btn>

                    <div class="column width-5">
                        <!-- TODO: make service component which can manage our all SVG items -->
                        <div class="c-m-auto c-mb-1" style="height: 40px; width: 40px;">
                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#F2C94C"/>
                                <path d="M0.859375 15V3.625H4.52344C5.52865 3.625 6.43229 3.85417 7.23438 4.3125C8.03646 4.76562 8.66146 5.40885 9.10938 6.24219C9.5625 7.07031 9.79167 8 9.79688 9.03125V9.55469C9.79688 10.5964 9.57552 11.5312 9.13281 12.3594C8.69531 13.1823 8.07552 13.8281 7.27344 14.2969C6.47656 14.7604 5.58594 14.9948 4.60156 15H0.859375ZM3.60156 5.74219V12.8906H4.55469C5.34115 12.8906 5.94531 12.612 6.36719 12.0547C6.78906 11.4922 7 10.6589 7 9.55469V9.0625C7 7.96354 6.78906 7.13542 6.36719 6.57812C5.94531 6.02083 5.33073 5.74219 4.52344 5.74219H3.60156ZM20.4062 11.1484C20.3698 11.9401 20.1562 12.6406 19.7656 13.25C19.375 13.8542 18.8255 14.3229 18.1172 14.6562C17.4141 14.9896 16.6094 15.1562 15.7031 15.1562C14.2083 15.1562 13.0312 14.6693 12.1719 13.6953C11.3125 12.7214 10.8828 11.3464 10.8828 9.57031V9.00781C10.8828 7.89323 11.0755 6.91927 11.4609 6.08594C11.8516 5.2474 12.4115 4.60156 13.1406 4.14844C13.8698 3.6901 14.7135 3.46094 15.6719 3.46094C17.0521 3.46094 18.1615 3.82552 19 4.55469C19.8385 5.27865 20.3151 6.27865 20.4297 7.55469H17.6953C17.6745 6.86198 17.5 6.36458 17.1719 6.0625C16.8438 5.76042 16.3438 5.60938 15.6719 5.60938C14.9896 5.60938 14.4896 5.86458 14.1719 6.375C13.8542 6.88542 13.6875 7.70052 13.6719 8.82031V9.625C13.6719 10.8385 13.8229 11.7057 14.125 12.2266C14.4323 12.7474 14.9583 13.0078 15.7031 13.0078C16.3333 13.0078 16.8151 12.8594 17.1484 12.5625C17.4818 12.2656 17.6589 11.7943 17.6797 11.1484H20.4062Z" transform="translate(10 11)" fill="black"/>
                            </svg>
                        </div>

                        <div class="c-m-auto caption grey--text">DEIP common</div>
                    </div>
                </div>

                <v-btn block color="primary" 
                    @click="convert()"
                    :loading="isConverting"
                    :disabled="isConverting"
                    type="submit"
                >Convert</v-btn>
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
            deipTokenBalance: { required: true, type: Number },
            commonTokensBalance: { required: true, type: Number}
        },
        data() { 
            return {
                isDeipToCommonMode: true,
                
                amount: '',
                isConverting: false,
                
                rules: {
                    required: value => !!value || 'This field is required',
                    deipTokenAmount: value => {
                        if (value.match(this.ASSET_QUANTITY_REGEX) === null) {
                            return "Incorrect format";
                        }

                        let number = parseFloat(value);

                        if (number === 0) {
                            return 'Amount should be greater than zero';
                        } else if (number > this.deipTokenBalance) {
                            return 'Amount is greater than DEIP token balance';
                        } else {
                            return true;
                        }
                    },
                    deipCommonAmount: value => {
                        if (value.match(/^\d+$/) === null) {
                            return "Incorrect format";
                        }

                        let number = parseInt(value);

                        if (number === 0) {
                            return 'Amount should be greater than zero';
                        } else if (number > this.commonTokensBalance) {
                            return 'Amount is greater than DEIP common balance';
                        } else {
                            return true;
                        }
                    },
                }
            }
        },
        methods: {
            convert() {
                if (this.$refs.form.validate()) {
                    this.isConverting = true;
                    let promise;

                    if (this.isDeipToCommonMode) {
                        // deip tokens to commons
                        promise = deipRpc.broadcast.transferToCommonTokensAsync(
                            this.user.privKey,
                            this.user.username,
                            this.user.username, // send myself (convert)
                            this.toAssetUnits(this.amount)
                        );
                    } else {
                        // commons to deip tokens
                        promise = deipRpc.broadcast.withdrawCommonTokensAsync(
                            this.user.privKey,
                            this.user.username,
                            parseInt(this.amount)
                        );
                    }

                    promise.then(data => {
                        this.$emit('convertingTransactionWasApplied');
                        this.$refs.form.reset();
                        this.amount = '';

                        this.$store.dispatch('layout/setSuccess', {
                            message: "Converting transaction was applied"
                        });

                        return data;
                    }).catch(() => {
                        this.$store.dispatch('layout/setError', {
                            message: "Transaction was failed"
                        });
                    }).finally(() => {
                        this.isConverting = false;
                    });
                }
            },
            changeMode() {
                this.isDeipToCommonMode = !this.isDeipToCommonMode;
                this.$refs.form.reset();

                this.amount = '';
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            }),
            amountInputHint() {
                let res = '';
                this.amount; // hack to trigger recounting of computed property when variable is wrapped by 'if'

                if (!_.isEmpty(this.$refs) && this.$refs.amount.valid) {
                    if (this.isDeipToCommonMode) {
                        let deipTokens = parseFloat(this.amount);
                        let commonTokens = deipTokens * 1000;

                        res = `${deipTokens} Deip Tokens = ${commonTokens} Deip Commons`;
                    } else {
                        let commonTokens = parseInt(this.amount);
                        let deipTokens = this.amount / 1000;

                        res = `${commonTokens} Deip Commons = ${deipTokens} Deip Tokens`;
                    }
                }

                return res;
            }
        },
        created() {
        }
    };
</script>

<style lang="less" scoped>
</style>
