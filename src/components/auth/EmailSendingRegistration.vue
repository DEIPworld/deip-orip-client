<template>
    <v-container fluid fill-height class="pa-0 justify-center">

        <div class="page-container">
            <div class="text-align-center">
                <div class="deip-emblem">
                    <div class="emblem-logo">Deip.world</div>
                    <div class="emblem-caption">Decentralized research platform</div>
                </div>
            </div>

            <v-form v-model="isFormValid" ref="form" v-show="!wasSent" class="c-mt-10">
                <v-text-field 
                    label="Email" 
                    single-line 
                    v-model="email" 
                    :rules="[rules.required, rules.email]"
                ></v-text-field>
                <v-btn block color="primary" @click="register()">Register</v-btn>
            </v-form>

            <div class="text-align-center c-mt-12" v-show="wasSent">
                <div class="subheading half-bold">Check your email</div>
                <div>Check your email and click the email validation link</div>
            </div>
        </div>

    </v-container>   
</template>

<script>
    export default {
        name: 'EmailSendingRegesitration',
        data() {
            return {
                isFormValid: false,
                email: '',
                isEmailUnique: undefined,
                wasSent: false,

                rules: {
                    required: (value) => !!value || 'Please fill E-mail field',
                    email: (value) => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid E-mail'
                    }
                }
            }
        },
        methods: {
            register() {
                if (this.$refs.form.validate()) {
                    //check isEmailUnique (now we don't have such method on BE)
                    console.log('Sending this email to server for further registration');
                    this.wasSent = true;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-container {
        width: 500px;
        height: 300px;
    }
</style>
