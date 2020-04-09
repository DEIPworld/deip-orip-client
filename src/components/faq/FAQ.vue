<template>
  <base-page-layout>
    <v-card slot="content" class="fill-height pa-5">
      <div class="display-1 font-weight-bold mb-3">Frequently Asked Questions</div>
      <div class="mb-4 body-2">
        Didn’t find what you were looking for?
        <router-link :to="'#'" class="a ml-1">Get in touch.</router-link>
      </div>
      <div class="mb-2">
        <router-link to="#what-is" class="a">What is TRL, MaRL, SRL?</router-link>
      </div>
      <div class="mb-2">
        <router-link to="#how-contractor" class="a">How can I become a contractor?</router-link>
      </div>
      <div class="mb-2">
        <router-link to="#how-investor" class="a">How can I become an investor?</router-link>
      </div>
      <div class="mb-2">
        <router-link
          to="#how-rewarded"
          class="a"
        >How is an investor/project funder getting rewarded?</router-link>
      </div>
      <v-divider class="my-4" />
      <div id="what-is" class="mb-5">
        <div class="headline font-weight-bold mb-3">What is TRL, MaRL, SRL?</div>
        <v-layout column body-2>
          <v-flex xs12>TRL: Technology Readiness Levels,</v-flex>
          <v-flex ml-4>
            <!-- <img src="/assets/img/trl.jpg" /> -->
          </v-flex>
        </v-layout>
        <v-layout column body-2>
          <v-flex>MaRL: Marketing Readiness Levels,</v-flex>
          <v-flex ml-4>
            <!-- <img src="/assets/img/mrl.jpg" /> -->
          </v-flex>
        </v-layout>
        <v-layout column body-2>
          <v-flex>SRL: Sales Readiness Levels.</v-flex>
          <v-flex ml-4>
            <!-- <img src="/assets/img/srl.jpg" /> -->
          </v-flex>
        </v-layout>
      </div>
      <v-layout row wrap mb-5 id="how-contractor">
        <v-flex xs12 headline font-weight-bold mb-3>How can I become a contractor?</v-flex>
        <v-flex
          xs12
          sm8
          body-2
        >You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.</v-flex>
      </v-layout>
      <v-layout row wrap mb-5 id="how-investor">
        <v-flex xs12 headline font-weight-bold mb-3>How can I become an investor?</v-flex>
        <v-flex
          xs12
          sm8
          body-2
        >You can sign up with us at ar3c.com/signup and select your category as “Investor”. Your application will be reviewed by our team and you will be added to our investor list. You can select the projects you want to invest in (using tokens) from your profile dashboard.</v-flex>
      </v-layout>
      <v-layout row wrap id="how-rewarded">
        <v-flex
          xs12
          headline
          font-weight-bold
          mb-3
        >How is an investor/project funder getting rewarded?</v-flex>
        <v-flex
          xs12
          sm8
          body-2
        >An investor/ project funder gets rewarded once the project goes into production. For every sale or the product or service or SaaS, you will receive tokens. Being an investor in the ACRDF, ARCF, AESIF and WECO2 Fund, you will receive dividends as well.</v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
export default {
  name: "FAQ",

  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
</style>