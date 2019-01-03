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
      <v-flex xs12>
        <v-divider></v-divider>
        <v-card>
            
        </v-card>
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
                agencyProfile: 'agency/agency',
                selectedArea: 'agency/area',
                program: 'agency/program',
                isLoadingAgencyProgramDetailsPage: 'agency/isLoadingAgencyProgramDetailsPage'
            }),
            breadcrumbs() {
              return [
                { text: this.agencyProfile.shortName, disabled: false, to: { name: 'AgencyPrograms', params: { agency: this.agencyProfile._id } }   }, 
                { text: "Programs", disabled: false, to: `${this.agencyProfile._id}/programs` },
                { text: this.selectedArea.abbreviation, disabled: false, to: `${this.agencyProfile._id}/programs` }, 
                { text: this.selectedArea.subAreaAbbreviation, disabled: false, to: `${this.agencyProfile._id}/programs` },
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
