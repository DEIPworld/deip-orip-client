<template>
    <v-container fluid fill-height class="pa-0 justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" class="c-mt-10" v-show="!isServerValidated">
                <div class="c-pb-6 text-align-center">
                    Please fill the fields for preliminary registration
                </div>

                <v-text-field 
                    label="Email"
                    v-model="formData.email" 
                    :rules="[rules.required, rules.email]"
                    @input="resetKey"
                ></v-text-field>

                <v-text-field 
                    label="First name"
                    v-model="formData.firstName" 
                    :rules="[rules.required, rules.nameChars]"
                    @input="resetKey"
                ></v-text-field>

                <v-text-field 
                    label="Last name"
                    v-model="formData.lastName" 
                    :rules="[rules.required, rules.nameChars]"
                    @input="resetKey"
                ></v-text-field>
                
                <v-text-field 
                    name="username"
                    label="Username"
                    v-model="formData.username" 
                    :rules="[
                        rules.required, 
                        rules.unique, 
                        rules.usernameFormat
                    ]"
                    @input="usernameChanged"
                    :loading="isUsernameChecking"
                ></v-text-field>

                <v-btn block color="primary" 
                    @click="generatePrivateKey()"
                    :disabled="!isFormValid || isUsernameVerifyed !== true || isSaving"
                >{{ !formData.privKey ? 'Generate' : 'Re-generate' }} private key</v-btn>

                <div v-show="formData.privKey !== null">
                    <v-text-field class="c-mt-4"
                        label="Your key"
                        disabled
                        multi-line no-resize rows="2"
                        v-model="formData.privKey"
                    ></v-text-field>

                    <v-checkbox
                        label="I have saved the key"
                        v-model="formData.isPrivKeySaved"
                        :disabled="isSaving"
                    ></v-checkbox>

                    <v-btn block color="primary" 
                        :loading="isSaving"
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved || isSaving"
                    >Finish registration</v-btn>

                <!-- <div class="row justify-center c-pt-3" v-show="isSaving">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div> -->
                </div>
            </v-form>

            <div class="c-mt-10" v-show="isServerValidated">
                <div class="text-align-center half-bold">
                    Thank you for your interest in DEIP!
                    <br>
                    The inviting letter will be sent to your email after approving
                </div>
            </div>
        </div>
    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-rpc';
    import _ from 'lodash';
    import authService from './../../services/auth'

    export default {
        name: 'SignUp',
        data() {
            return {
                isFormValid: false,
                isUsernameVerifyed: undefined,
                isUsernameChecking: false,
                isSaving: false,
                isServerValidated: false, // true only when server accepts all information

                formData: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    username: '',
                    privKey: null,
                    pubKey: null,
                    isPrivKeySaved: false
                },

                rules: {
                    required: value => !!value || 'This field is required',
                    unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
                    nameChars: value => 
                        value.match(/^[a-z][a-z ,.'-]*$/i) !== null 
                        || "Incorrect value",
                    usernameFormat: value => {
                        var result = deipRpc.utils.validateAccountName(value);
                        return result === null || result;
                    },
                    email: (value) => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid E-mail'
                    }
                }
            }
        },
        methods: {
            resetKey() {
                if (this.formData.privKey) {
                    this.formData.privKey = null;
                }
            },
            finishRegistration() {
                const self = this;
                console.log(this.formData);
                this.isSaving = true;

                delete this.formData.privKey;

                authService.signUp(this.formData)
                    .then(() => {
                        this.isSaving = false;
                        this.isServerValidated = true;
                    }, (err) => {
                        this.isSaving = false;

                        const message = err.response && err.response.data && err.response.data.errors[0] 
                            ? err.response.data.errors[0] 
                            : "Sorry, the service is temporarily unavailable, please try again later";

                        self.$store.dispatch('layout/setError', {
                            isVisible: true, 
                            message: message
                        });
                        console.log(err);
                    });
            },
            generatePrivateKey() {
                let keys = deipRpc.auth.getPrivateKeys(
                    this.formData.username,
                    (new Date()).getTime().toString(),
                    ['owner']
                );

                this.formData.privKey = keys.owner;
                this.formData.pubKey = keys.ownerPubkey;

                this.formData.isPrivKeySaved = false;
            },
            usernameChanged: _.debounce(
                function() {
                    this.isUsernameVerifyed = undefined;
                    this.resetKey();

                    if (this.formData.username !== '') {
                        this.isUsernameChecking = true;

                        deipRpc.api.getAccountsAsync([this.formData.username])
                            .then(res => { this.isUsernameVerifyed = _.isEmpty(res); })
                            .catch(error => { this.isUsernameVerifyed = false; })
                            .finally(() => {
                                this.isUsernameChecking = false;
                                let usernameInput = _.find(this.$refs.form.inputs, input => input.$attrs.name === 'username');
                                usernameInput.validate();
                            });
                    }
                }, 
                600
            )
        }
    }
</script>

<style lang="less" scoped>
    .page-container {
        width: 500px;
        min-height: 100%;
        padding: 40px 0;
    }
</style>
