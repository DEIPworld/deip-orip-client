<template>
  <v-dialog
    v-model="isShown"
    fullscreen
    persistent
    transition="scale-transition"
  >
    <v-card class="">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Allocation of Expertise Tokens</v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-row>
        <v-col class="fill-height pa-12 xs12">
          <div class="text-h5 text-align-center">
            You are suggesting to supply

            <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: claimer.account.name }}">
              {{ claimer | fullname }}
            </router-link>

            with Expertise Tokens in "{{ discipline.label }}" discipline
          </div>

          <v-form ref="form" v-model="isFormValid" style="margin-top: 50px">
            <div class="discipline-picker c-mt-8">
              <v-text-field
                v-model="amount"
                outlined
                label="Amount of Expertise Tokens"
                :rules="[required, digitRule]"
              />
            </div>

            <div class="red--text text-align-center">
              <v-icon color="red">
                warning
              </v-icon>
              Please be accurate, you will need the community assistance to change the disciplines
            </div>

            <div class="c-pt-6">
              <v-textarea
                v-model="description"
                label="Provide a cover letter"
                outlined
                auto-grow
                :rows="6"
                :rules="[required]"
              />
            </div>
          </v-form>

          <div class="legacy-row legacy-justify-center c-p-6">
            <v-btn
              color="primary"
              :disabled="!isFormValid || isLoading"
              :loading="isLoading"
              @click="createExpertiseAllocationProposal()"
            >
              Create proposal
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { getNodeById } from '../../../common/disciplines/DisciplineTreeService';

  export default {
    name: 'ClaimUserExpertiseDetailsAllocationDialog',
    props: {
      isShown: { type: Boolean, required: true },
      claimer: { type: Object, required: true },
      disciplineId: { type: Number, required: true }
    },
    data() {
      return {
        DIGIT_REGEX: /^\d+$/,
        digitRule: (value) => (value.match(this.DIGIT_REGEX) === null ? 'Incorrect amount format' : true),
        required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
        isFormValid: false,
        isLoading: false,

        amount: '',
        description: '',
        discipline: getNodeById(this.disciplineId)
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    watch: {
      isShown(newValue) {
        if (newValue) {
          this.$refs.form.reset();

          this.amount = '';
          this.description = '';
        }
      }
    },
    methods: {
      createExpertiseAllocationProposal() {
        this.isLoading = true;

        deipRpc.broadcast.createExpertiseAllocationProposalAsync(
          this.user.privKey,
          this.user.username,
          this.claimer.account.name,
          this.disciplineId,
          parseInt(this.amount),
          this.description,
          []
        ).then(() => {
          this.$notifier.showSuccess('Proposal was successfully created');

          this.$emit('onCreate');

          setTimeout(() => this.$emit('close'), 1000);
        }).catch((err) => {
          this.$notifier.showError('Error occured');

          console.error(err);
        }).finally(() => {
          this.isLoading = false;
        });
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
