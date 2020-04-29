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
      <div class="mb-2">
        <router-link to="#what-is" class="a">
          What is TRL, MaRL, SRL?
        </router-link>
      </div>
      <div class="mb-2">
        <router-link to="#how-contractor" class="a">
          How can I become a contractor?
        </router-link>
      </div>
      <div class="mb-2">
        <router-link to="#how-investor" class="a">
          How can I become an investor?
        </router-link>
      </div>
      <div class="mb-2">
        <router-link
          to="#how-rewarded"
          class="a"
        >
          How is an investor/project funder getting rewarded?
        </router-link>
      </div>
      <v-divider class="my-6" />
      <div id="what-is" class="mb-12">
        <div class="headline font-weight-bold mb-4">
          What is TRL, MaRL, SRL?
        </div>
        <v-row class="body-2" column>
          <v-col cols="12">
            TRL: Technology Readiness Levels,
          </v-col>
          <v-col class="ml-6">
            <!-- <img src="/assets/img/trl.jpg" /> -->
          </v-col>
        </v-row>
        <v-row class="body-2" column>
          <v-col>MaRL: Marketing Readiness Levels,</v-col>
          <v-col class="ml-6">
            <!-- <img src="/assets/img/mrl.jpg" /> -->
          </v-col>
        </v-row>
        <v-row class="body-2" column>
          <v-col>SRL: Sales Readiness Levels.</v-col>
          <v-col class="ml-6">
            <!-- <img src="/assets/img/srl.jpg" /> -->
          </v-col>
        </v-row>
      </div>
      <v-row id="how-contractor" class="mb-12">
        <v-col class="headline font-weight-bold mb-4" cols="12">
          How can I become a contractor?
        </v-col>
        <v-col
          class="body-2"
          cols="12"
          sm="8"
        >
          You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.
        </v-col>
      </v-row>
      <v-row id="how-investor" class="mb-12">
        <v-col class="headline font-weight-bold mb-4" cols="12">
          How can I become an investor?
        </v-col>
        <v-col
          class="body-2"
          cols="12"
          sm="8"
        >
          You can sign up with us at ar3c.com/signup and select your category as “Investor”. Your application will be reviewed by our team and you will be added to our investor list. You can select the projects you want to invest in (using tokens) from your profile dashboard.
        </v-col>
      </v-row>
      <v-row id="how-rewarded">
        <v-col
          class="headline font-weight-bold mb-4"
          cols="12"
        >
          How is an investor/project funder getting rewarded?
        </v-col>
        <v-col
          class="body-2"
          cols="12"
          sm="8"
        >
          An investor/ project funder gets rewarded once the project goes into production. For every sale or the product or service or SaaS, you will receive tokens. Being an investor in the ACRDF, ARCF, AESIF and WECO2 Fund, you will receive dividends as well.
        </v-col>
      </v-row>
    </v-card>
  </base-page-layout>
</template>

<script>
  export default {
    name: 'FAQ',

    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
</style>
