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
                    Thank you for your interest in DEIP!
                    <br>
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
                    v-model="formData.firstname" 
                    :rules="[rules.required, rules.nameChars]"
                    @input="resetKey"
                ></v-text-field>
                <v-text-field 
                    label="Last name"
                    v-model="formData.lastname" 
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
                        rules.usernameLength,
                        rules.usernameChars
                    ]"
                    @input="usernameChanged"
                    :loading="isUsernameChecking"
                ></v-text-field>

                <v-btn block color="primary" 
                    @click="generatePrivateKey()"
                    :disabled="!isFormValid || isUsernameVerifyed !== true || isSaving"
                >{{ !formData.privKey ? 'Generate' : 'Re-generate' }} private key</v-btn>

                <div v-show="formData.privKey">
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
                        v-show="!isSaving"
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved"
                    >Finish registration</v-btn>

                    <div class="row justify-center c-pt-3" v-show="isSaving">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                </div>
            </v-form>

            <div class="c-mt-10" v-show="isServerValidated">
                <div class="text-align-center">
                    Thank you for your interest in DEIP!
                    <br>
                    The inviting letter will be send to your email after approving
                </div>
            </div>

            <v-snackbar :timeout="4000" color="error" v-model="isServerError">
                Server error
                <v-btn dark flat @click.native="isServerError = false">Close</v-btn>
            </v-snackbar>
        </div>

    </v-container>   
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'PreliminaryRegistration',
        data() {
            return {
                isFormValid: false,
                isUsernameVerifyed: undefined,
                isUsernameChecking: false,
                
                isSaving: false,
                isServerValidated: false, // true only when server accepts all information
                isServerError: false,

                formData: {
                    email: '',
                    firstname: '',
                    lastname: '',
                    username: '',
                    privKey: undefined,
                    pubKey: undefined,
                    isPrivKeySaved: false
                },

                rules: {
                    required: value => !!value || 'This field is required',
                    unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
                    nameChars: value => 
                        value.match(/^[a-z][a-z ,.'-]+$/i) !== null 
                        || "Incorrect value",
                    usernameLength: value => value.length >= 3 && value.length <= 16 || 'Length should be between 3 and 16 characters',
                    usernameChars: value => 
                        value.match(/^[A-Za-z][a-z0-9\-]+[a-z0-9]*$/) !== null 
                        || "First character must be a-z (lower case), the last character can be a-z or 0-9 (lower case letter or number) and second and up to second last can be a-z (lower case), 0-9 and '-'",
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
                    this.formData.privKey = undefined;
                }
            },
            finishRegistration() {
                console.log(this.formData);
                this.formData; // object which has all necessary info

                this.isSaving = true;

                setTimeout(() => {
                    this.isSaving = false;
                    
                    // condition is just for testing
                    if (this.formData.username === 'error') {
                        this.isServerError = true;
                    } else {
                        this.isServerValidated = true;
                    }
                }, 1500);
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
