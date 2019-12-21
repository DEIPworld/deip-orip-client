<template>
  <v-container fluid  class="pa-0 c-mt-10">
    <v-layout row wrap fill-height align-space-around justify-space-around text-xs-center>
      <v-flex xs3></v-flex>
      <v-flex xs5>
        <div>
          <div class="text-align-center">
            <div v-if="tenant">
              <img width="200px" height="200px" :src="tenant | tenantSymbolSrc(160, 160, false)" />
            </div>
            <!-- <div class="title c-pb-4 bold">Welcome to</div>
            <div class="deip-emblem">
              <div class="emblem-logo">Deip.world</div>
                <div class="emblem-caption">Decentralized research platform</div>
                <div v-if="tenant" class="c-pt-5 subheading" style="text-decoration: underline">Use credentials from Grants Community Blockchain</div>
            </div> -->
            <div>
              <v-form v-model="isFormValid" ref="form" class="mt-4" @submit.prevent>
                <v-text-field 
                  label="Username"
                  v-model="username" 
                  :rules="[rules.required]"
                ></v-text-field>

                <v-text-field 
                  label="Private key"
                  v-model="privKey" 
                  :rules="[rules.required]"
                  :append-icon="isHiddenPassword ? 'visibility' : 'visibility_off'"
                  :type="isHiddenPassword ? 'password' : 'text'"
                  @click:append="() => { isHiddenPassword = !isHiddenPassword }"
                ></v-text-field>

                <v-btn type="submit"
                  block 
                  color="primary" 
                  :loading="isChecking" 
                  :disabled="isChecking" 
                  @click="login()"
                >Login</v-btn>
              </v-form>
            </div>
					</div>
				</div>
      </v-flex>
			<v-flex xs3>
			</v-flex>
    </v-layout>
  </v-container>   
</template>

<script>

import deipRpc from '@deip/deip-oa-rpc-client'
import crypto from '@deip/lib-crypto'
import authService from './../../services/http/auth'
import {decodedToken, clearAccessToken, setAccessToken} from './../../utils/auth'
import { mapGetters } from 'vuex';

export default {
  name: 'SignIn',

  computed: {
    ...mapGetters({
      tenant: 'auth/tenant'
    })
  },

  data() {
    return {
      isFormValid: false,
      username: '',
      privKey: '',
      isHiddenPassword: true,
      isChecking: false,
      rules: {
        required: (value) => !!value || 'This field is required'
      }
    }
  },

  methods: {
    login() {
      const self = this;

      if (this.$refs.form.validate()) {
        this.isChecking = true;
        const privKey = this.privKey;
        var secretKey;
        try {
          secretKey = crypto.PrivateKey.from(privKey);
        } catch(err) {
          clearAccessToken();
          this.isChecking = false;
          self.$store.dispatch('layout/setError', { message: "Invalid private key format"});
          return;
        }

        // sig-seed should be uint8 array with length = 32
        const secretSig = secretKey.sign(encodeUint8Arr(window.env.SIG_SEED).buffer);
        const secretSigHex = crypto.hexify(secretSig);
        authService.signIn({
          username: this.username,
          secretSigHex: secretSigHex,
          agency: this.tenant._id
        })
          .then((response) => {
              if (response.success) {

                const decoded = decodedToken(response.jwtToken);
                const pubKey = decoded.pubKey;
                
                // this validation is not necessary as we validate private key at the server using signature
                var isValid;
                try {
                  isValid = deipRpc.auth.wifIsValid(this.privKey, pubKey);
                } catch (err) {
                  isValid = false;
                }
                
                if (isValid) {
                  // The jwt is being used by Vue router and File uploader api
                  // to verify that user has logged successfully and entered his private key.
                  // TODO: We should make decision on how to store private keys at UI. 
                  // For now we can use local storage but it's not secure enough due to XSS attacks
                  // and compromised thirdparty sources.
                  setAccessToken(response.jwtToken, this.privKey)
                  this.isChecking = false;
                  this.isServerValidated = true;
                  this.$router.go('/');
                } else {
                  clearAccessToken();
                  this.isChecking = false;
                  self.$store.dispatch('layout/setError', { message: `Invalid private key for "${self.username}"`});
                }

              } else {
                clearAccessToken();
                this.isChecking = false;
                self.$store.dispatch('layout/setError', { message: response.error});
              }

          }, (err) => {
            clearAccessToken();
            this.isChecking = false;
            self.$store.dispatch('layout/setError', { message: err.message});
          });
      }

      function encodeUint8Arr(myString) {
        return new TextEncoder("utf-8").encode(myString);
      }
    }
  },
  
  created() {
    this.username = this.$route.query.username || '';
  }
}
</script>

<style>
 
</style>
