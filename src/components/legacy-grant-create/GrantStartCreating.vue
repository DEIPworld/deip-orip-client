<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row>
      <div class="c-m-auto page-container">
        <div class="text-align-center display-1 bold">
          Grants distribution
        </div>

        <div class="legacy-row c-pt-12">
          <div class="legacy-col-grow c-pr-8">
            <v-btn
              block
              color="primary"
              class="ma-0"
              :to="{ name: 'CreateDisciplineGrant' }"
            >
              Discipline supply grant
            </v-btn>

            <div class="c-pt-8 text-align-right">
              <div class="bold">
                Indirect Grant is
              </div>
              DEIP Token holders can allocate grants to a particular discipline. In this case funds are distributed among
              research groups working in this domain in accordance with their Expertise Contribution Index
            </div>
          </div>

          <div class="vertical-devider" />

          <div class="legacy-col-grow c-pl-8">
            <v-btn
              block
              color="primary"
              class="ma-0"
              :to="{ name: 'CreateDirectGrant' }"
            >
              Direct grant
            </v-btn>

            <div class="c-pt-8 text-align-left">
              <div class="bold">
                Direct Grant is
              </div>
              DEIP Token holders are able to allocate a grant to a research group or to a particular research. In this case
              the grant is directly transferred to the research group account.
            </div>
          </div>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'GrantStartCreating',
    data() {
      return {};
    }
  };
</script>

<style lang="less" scoped>
    @import '../../styles/colors.less';

    .page-container {
        width: 600px;
    }

    .vertical-devider {
        width: 1px;
        background-color: @black-lighter;
    }
</style>
