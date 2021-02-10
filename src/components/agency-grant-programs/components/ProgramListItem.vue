<template>
  <div>
    <div v-if="isFirst" class="program-divider">
      <v-divider />
    </div>
    <v-row no-gutters class="pl-6 pb-2">
      <v-col cols="9">
        <div class="pl-6 pt-2">
          <router-link class="a text-subtitle-1" :to="{ name: 'GrantProgramDetails', params: { foa: program.funding_opportunity_number }}">
            {{ program.additional_info.funding_opportunity_title }}
          </router-link>
        </div>
        <v-row no-gutters class="pl-6 pt-2 pb-2">
          <v-col class="text-caption grey--text">
            <span class="pr-2">Posted Date:</span>
            <v-icon color="grey" small>
              event
            </v-icon>
            <span>{{ new Date(`${program.posted_date}Z`).toDateString() }}</span>
          </v-col>
          <v-col class="text-caption grey--text">
            <span class="pr-2">Closing Date:</span>
            <v-icon color="grey" small>
              event
            </v-icon>
            <span>{{ new Date(`${program.close_date}Z`).toDateString() }}</span>
          </v-col>
          <v-col class="text-caption grey--text">
            <span>#{{ program.funding_opportunity_number }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" offset="1" class="text--center">
        <div class="grey--text pt-4 text-body-2">
          FUNDING
        </div>
        <div class="text-h6 pt-2 font-weight-bold">
          $ {{ fromAssetsToFloat(program.amount) }}
        </div>
      </v-col>
    </v-row>
    <div class="program-divider">
      <v-divider />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProgramListItem',
    props: {
      program: { required: true, default: undefined },
      isFirst: { default: false }
    },
    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
    .program-divider {
        padding-left: 3%;
        padding-right: 3%;
    }
</style>
