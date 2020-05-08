<template>
  <base-page-layout>
    <v-card flat class="fill-height pa-12">
      <div class="display-1 font-weight-bold mb-4">
        Frequently Asked Questions
      </div>
      <div class="mb-6 body-2">
        Didn’t find what you were looking for?
        <router-link :to="'#'" class="a ml-1">
          Get in touch.
        </router-link>
      </div>
      <div
        v-for="(item, i) in faqs"
        :key="`${i}-faq`"
        class="mb-2"
      >
        <router-link :to="`#question${i+1}`" class="a">
          {{ item.question }}
        </router-link>
      </div>

      <v-divider class="my-6" />

      <v-row
        v-for="(item, i) in faqs"
        :id="`question${i+1}`"
        :key="`${i}-allfaq`"
        no-gutters
        class="mb-12"
      >
        <v-col class="headline font-weight-bold mb-4" cols="12">
          {{ item.question }}
        </v-col>
        <v-col
          class="body-2 white-space-pre-line"
          cols="12"
          sm="8"
        >
          {{ item.answer }}
        </v-col>
      </v-row>
    </v-card>
  </base-page-layout>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: 'FAQ',

    data() {
      return {};
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      }),
      faqs() {
        return this.tenant.profile.settings.faq.filter(({ isVisible }) => isVisible);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
