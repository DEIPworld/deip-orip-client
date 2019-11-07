<template>
  <v-card height="100%">
    <v-layout row wrap style="flex: 0 0 auto;" class="full-width">
      
      <v-layout column class="pa-4">
        <div class="subheading half-bold pb-2">My Lists</div>
        <v-layout v-for="(list, i) in lists" :key="'list-' + i" row justify-space-between class="py-1">
          <span><span class="dot mr-1" :style="{ 'background-color': list.color }"></span>{{list.name}}</span>
          <span>{{list.count}}</span>
        </v-layout>
        <v-btn round outline block large color="primary" class="new-list py-1 mt-3">
          <v-icon small left>add</v-icon>
          Add new list
        </v-btn>
      </v-layout>

      <v-layout column class="full-width py-2">
        <v-divider></v-divider>
      </v-layout>

      <v-layout column class="px-4 py-2">
        <div class="subheading half-bold pb-2">Saved Search</div>
        <v-layout v-for="(item, i) in savedSearchList" :key="'search-' + i" row justify-space-between>
          <a class="a" href="#">{{item.name}}</a>
        </v-layout>
      </v-layout>

      <v-layout column class="px-4 py-2">
        <div class="subheading half-bold pb-2">Saved Comparison</div>
        <v-layout v-for="(item, i) in savedComparisonList" :key="'comparison-' + i" row justify-space-between>
          <a class="a" href="#">{{item.name}}</a>
        </v-layout>
      </v-layout>

    </v-layout>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'InvestorDashboardInboxLeftSidebar',
    data() {
      return {
        lists: [
          { name: "CO2", count: 8, color: "#9ec69f" },
          { name: "Plastic for review", count: 1, color: "#f2c94c" },
          { name: "Organic", count: 8, color: "#ffaf9a" },
          { name: "Textiles", count: 2, color: "#a35078" },
          { name: "Meds", count: 3, color: "#8fc3f7" },
          { name: "Chem", count: 2, color: "#2962ff" }
        ],

        savedSearchList: [
          { name: "Belarus", query: "" },
          { name: "11.09.2018", query: "" },
          { name: "Undiscovered", query: "" },
          { name: "Physics", query: "" },
          { name: "Popular", query: "" },
          { name: "Medicine & Health", query: "" },
        ],

        savedComparisonList: [
          { name: "11.10.2018 Computer science", query: "" },
          { name: "Reviewed research", query: "" }
        ]
      }
    },

    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>

.dot {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}

.new-list {
  text-transform: none;
}

</style>
