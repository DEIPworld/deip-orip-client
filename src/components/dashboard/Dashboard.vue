<template>
  <v-container fluid fill-height pa-0 ma-0 class="dashboard-page">

    <v-layout row class="full-width full-height">
      <v-flex xl12 lg12 md12 sm12 xs12>
        <v-tabs color="#fafafa">
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab href="#tab-summary">Summary</v-tab>
          <v-tab href="#tab-projects">Projects</v-tab>
          <v-tab href="#tab-investments">Investments</v-tab>
          <v-tab href="#tab-reviews">Reviews</v-tab>
          <v-tab href="#tab-experts">Experts</v-tab>
          <v-tab href="#tab-ip-protection">IP protection</v-tab>
          <v-spacer></v-spacer>

          <v-tabs-items>
            <v-tab-item value="tab-summary">
              <v-layout row class="full-width full-height">
                <v-card color="white" height="100%" class="full-width full-height elevation-0 pt-4 glass-container">
                  <v-layout row wrap>

                    <v-flex xl4 lg4 md4 sm12 xs12 class="projects-column">
                      <v-layout row justify-space-between>
                        <div class="title bold">Projects <span class="primary--text pl-2">8</span></div>
                        <div>
                          <v-btn color="primary" small class="ma-0">
                            Create Project
                            <v-icon small>add</v-icon>
                          </v-btn>
                        </div>
                      </v-layout>
                    </v-flex>

                    <v-flex lxl8 lg8 md8 sm12 xs12>
                      <v-layout row wrap>
                        <v-flex lxl6 lg6 md6 sm12 xs12 class="investments-column">
                          <v-layout row justify-space-between>
                            <div class="title bold">Investments</div>
                            <div></div>
                          </v-layout>
                        </v-flex>
                        <v-flex xl6 lg6 md6 sm12 xs12 class="reviews-column">
                          <v-layout row justify-space-between>
                            <div class="title bold">Reviews</div>
                            <div>
                              <v-btn color="primary" small outline class="ma-0">
                                Ask for Review
                              </v-btn>
                            </div>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex lx12 lg12 md12 sm12 xs12 class="total-assets-column">
                          <div class="title bold">Total assets value</div>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                  </v-layout>
                </v-card>
              </v-layout>
            </v-tab-item>
            <v-tab-item value="tab-projects">
              Projects content
            </v-tab-item>
            <v-tab-item value="tab-investments">
              Investments content
            </v-tab-item>
            <v-tab-item value="tab-reviews">
              Reviews content
            </v-tab-item>
            <v-tab-item value="tab-experts">
              Experts content
            </v-tab-item>
            <v-tab-item value="tab-ip-protection">
              IP-protection content
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  
  computed: {
    ...mapGetters({
      user: "auth/user",
    })
  },
  data() {
    return {
    };
  },

  created() {}
};
</script>

<style lang="less" scoped>

@import "./../../styles/colors.less";

.glass-container {
  padding-left: 5%;
  padding-right: 5%;
}

.projects-column {
  padding-left: 1%;
  padding-right: 1%;
  overflow: scroll; 
}

.investments-column {
  padding-left: 1%;
  padding-right: 1%;
  border-left: 1.8px solid @grey-lighten-2;
  border-right: 1.8px solid @grey-lighten-2;
}

.reviews-column {
  padding-left: 1%;
  padding-right: 1%;
}

.total-assets-column {
  padding-left: 1%;
  padding-right: 1%;
}

</style>
