<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in breadcrumbs"
                        :key="item.text" 
                        :disabled="item.disabled" 
                        :to="item.to">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs9>
        <v-card class="c-pl-5 c-pr-5 c-pb-10">
          <v-layout row wrap>
            <v-flex xs12>
              <div class="display-1 c-pb-10 c-pt-10">{{program.title}}</div>
              <v-divider></v-divider>
            </v-flex>
            
            <v-flex xs12>
              <div class="row c-pt-10">
                <span class="col-grow body-1">Agency Name</span>
                <span class="col-grow body-2">{{agencyProfile.name}}</span>

                <span class="col-grow body-1">Estimated total program funding:</span>
                <span class="col-grow body-2">$ {{program.estimatedTotalFunding}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Opportunity Number:</span>
                <span class="col-grow body-2">{{program.number}}</span>

                <span class="col-grow body-1">Expected number of awards:</span>
                <span class="col-grow body-2">{{program.expectedNumberOfAwards}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Area:</span>
                <span class="col-grow body-2">{{program.area.title}}</span>

                <span class="col-grow body-1">Award ceiling:</span>
                <span class="col-grow body-2">$ {{program.awardCeiling}}</span>
              </div> 
              <div class="row c-pt-5">
                <span class="col-grow body-1">Open date:</span>
                <span class="col-grow body-2">{{program.postedDate.toDateString()}}</span>

                <span class="col-grow body-1">Award floor:</span>
                <span class="col-grow body-2">$ {{program.awardFloor}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Close date:</span>
                <span class="col-grow body-2">{{program.closingDate.toDateString()}}</span>

                <span class="col-grow body-1">Number of applications:</span>
                <span class="col-grow body-2">0</span>
              </div>
            </v-flex>

            <v-flex xs12>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-divider></v-divider>
        <v-layout row wrap text-xs-center>
          <v-flex xs12>
            <v-card>
              <div class="c-pt-5 c-pb-5">
                <v-avatar size="120px">
                    <img :src="agencyProfile.logo | agencyLogoSrc(160, 160, false)" />
                </v-avatar>
              </div>
            </v-card>
            <v-divider></v-divider>
          </v-flex> 
        </v-layout>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "AgencyProgramDetails",
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters({
                agencyProfile: 'agencyProgramDetails/agency',
                program: 'agencyProgramDetails/program'
            }),
            breadcrumbs() {
              return [
                { text: this.agencyProfile.shortName, disabled: false, to: `${this.agencyProfile._id}/programs` }, 
                { text: "Programs", disabled: false, to: `${this.agencyProfile._id}/programs` },
                { text: this.program.area.abbreviation, disabled: false, to: `/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` }, 
                { text: this.program.subArea.abbreviation, disabled: false, to:`/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` },
                { text: this.program.title, disabled: true }
              ];
            }
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style lang="less" scoped>

  .sub-area-list-item {
    cursor: pointer;
  }

  .sub-area-list-item:hover {
    background: #f1f8fe;
  }

  .sub-area-list-item.active {
    background: #f1f8fe;
  }

  .sub-area-list-item-content {
    padding-left: 20%;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-right: 5%;
    min-height: 45px;
  }

  .sort-option {
    cursor: pointer;
  }

  .sort-icon {
    min-width: 24px; 
    min-height: 24px;
  }

</style>
