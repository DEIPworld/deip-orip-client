<template>
  <modal-route-view :title="title">
    <v-form ref="form" v-model="isFormValid">
      <v-textarea
        v-model="formData.question"
        outlined
        auto-grow
        rows="1"
        label="Question"
        :rules="[rules.required]"
        :disabled="isSaving"
      />
      <v-textarea
        v-model="formData.answer"
        outlined
        auto-grow
        rows="8"
        label="Answer"
        :rules="[rules.required]"
        :disabled="isSaving"
      />

      <div class="text-right mt-5">
        <v-btn
          color="primary"
          class="mr-4"
          text
          :loading="isSaving"
          :disabled="isSaving"
          @click="$router.back()"
        >Cancel</v-btn>
        <v-btn color="primary" :loading="isSaving" :disabled="isSaving" @click="save()">Save</v-btn>
      </div>
    </v-form>
  </modal-route-view>
</template>

<script>
  import ModalRouteView from '@/components/layout/ModalRouteView';
  import moment from 'moment';
  import deipRpc from '@deip/rpc-client';
  import { AuthService } from '@deip/auth-service';
  import _ from 'lodash';

  import { mapGetters } from 'vuex';

  const authService = AuthService.getInstance();

  export default {
    name: 'AdminFAQEdit',
    components: { ModalRouteView },
    props: {
      title: {
        type: String,
        default: 'Sign Up'
      },
      hideAgree: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: { required: (value) => !!value || 'This field is required' },

        isFormValid: false,
        questions: [
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 1,
            isVisible: false
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 2,
            isVisible: true
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 3,
            isVisible: false
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 4,
            isVisible: true
          }
        ],
        isSaving: false,
        formData: {
          question: '',
          answer: '',
          isVisiible: false
        }
      };
    },
    created() {
      if (this.$route.query.id) {
        const editFAQ = this.questions.find(
          ({ id }) => id === this.$route.query.id
        );
        this.formData = { ...editFAQ };
      }
    },
    methods: {
      save() {
        if (!this.$refs.form.validate()) return;

        this.isSaving = true;

        const { question, answer, isVisiible } = this.formData;

        console.log(question, answer, isVisiible);

        setTimeout(() => this.$router.push({ name: 'admin.faq' }), 1000);
      }
    }
  };
</script>

<style scoped>
</style>
