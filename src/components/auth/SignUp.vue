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

                <div class="c-pv-4 text-align-justify">
                    Decentralized research platform “DEIP” will use the information you provide on this form to add you to 
                    the list of private beta participants. As soon as you finish the registration (add all the required 
                    information, generate and save the private key, and press the “Finish Registration” Button that appears 
                    after you generate and save the key), you will be added to the list and the manager from the side of 
                    DEIP either accept or decline your request. The procedure can take about a week. After the request 
                    is accepted you can use the generated key to access the private beta.<br><br>
                    Until you press the button “Finish Registration” no data is stored. Press the “Generate Private Key” to 
                    receive the private key.
                </div>

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

                    <div class="text-align-justify">
                        <div class="sm-title half-bold c-pb-4">Permission to use the data</div>

                        Please, confirm you have saved the generated key and want to be added to the list of private beta
                        participants with the information specified above:
                    </div>

                    <v-checkbox
                        class="c-mv-4"
                        label="I have saved the key and want to be added to the list"
                        v-model="formData.isPrivKeySaved"
                        :disabled="isSaving"
                        hide-details
                    ></v-checkbox>

                    <div class="c-pb-4 text-align-justify">
                        All the data (except your private key) will be stored in the DEIP cloud server.
                        You can change your mind at any time by clicking the unsubscribe link in the footer of any email
                        you receive from us, or by contacting us at
                        <a class="a" href="mailto:info@deip.world">info@deip.world</a>.
                        We will treat your information with respect. For more information about our privacy terms please read our
                        <a class="a">Privacy Policy</a>.
                        By clicking below, you agree that we may process your information in accordance with these terms.
                    </div>

                    <v-btn block color="primary" 
                        :loading="isSaving"
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved || isSaving"
                    >Finish registration</v-btn>
                </div>
            </v-form>

            <div class="c-mt-10" v-show="isServerValidated">
                <div class="text-align-center half-bold">
                    Thank you for your interest in DEIP!<br>
                    The inviting letter will be sent to your email after approving
                </div>
            </div>
        </div>
    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
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

                        self.$store.dispatch('layout/setError', { message: message });
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
