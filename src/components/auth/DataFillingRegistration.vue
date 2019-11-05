<template>
    <v-container fluid fill-height class="pa-0 legacy-justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" class="c-mt-10">
                <div class="c-pb-6">
                    Thank you for your interest in DEIP!
                    <br>
                    To finish the registration and getting limit-less access to the newest research please type your name and save the private key
                </div>

                <!-- <v-text-field single-line v-model="email" disabled></v-text-field> -->

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
                        rules.usernameLength,
                        rules.usernameChars
                    ]"
                    @input="usernameChanged"
                    :loading="isUsernameChecking"
                ></v-text-field>

                <v-btn block color="primary" 
                    @click="generatePrivateKey()"
                    :disabled="!isFormValid || isUsernameVerifyed !== true"
                >{{ !formData.privKey ? 'Generate' : 'Re-generate' }} private key</v-btn>

                <div v-show="formData.privKey">
                    <v-text-field class="c-mt-4"
                        label="Your key"
                        disabled
                        v-model="formData.privKey"
                    ></v-text-field>

                    <v-checkbox
                        label="I have saved the key"
                        v-model="formData.isPrivKeySaved"
                    ></v-checkbox>

                    <v-btn block color="primary" 
                        @click="finishRegistration()"
                        :disabled="!formData.isPrivKeySaved"
                    >Finish registration</v-btn>
                </div>
            </v-form>
        </div>

    </v-container>   
</template>

<script>
    import deipRpc from '@deip/deip-oa-rpc-client';
    import _ from 'lodash';

    export default {
        name: 'DataFillingRegesitration',
        data() {
            return {
                isFormValid: false,
                email: 'myemail@email.com',
                isUsernameVerifyed: undefined,
                isUsernameChecking: false,

                formData: {
                    firstName: '',
                    lastName: '',
                    username: '',
                    privKey: undefined,
                    pubKey: undefined,
                    isPrivKeySaved: false
                },

                rules: {
                    required: value => !!value || 'This field is required',
                    unique: value => !!value && this.isUsernameVerifyed !== false || 'Username should be unique in system',
                    nameChars: value => 
                        value.match(/^[a-z][a-z ,.'-]*$/i) !== null 
                        || "Incorrect value",
                    usernameLength: value => value.length >= 3 && value.length <= 16 || 'Length should be between 3 and 16 characters',
                    usernameChars: value => 
                        value.match(/^[a-z][a-z0-9\-]+[a-z0-9]$/) !== null 
                        || "First character must be a-z (lower case), the last character can be a-z or 0-9 (lower case letter or number) and second and up to second last can be a-z (lower case), 0-9 and '-'",
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
                this.formData; // object which has all necessary info
                // here should be BE calling to save all data

                 this.$router.push({ name: 'ClaimExpertiseRegesitration' });
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
        width: 550px;
        min-height: 100%;
        padding: 40px 0;
    }
</style>
