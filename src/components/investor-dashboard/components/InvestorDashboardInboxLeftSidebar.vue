<template>
  <v-card height="100%">
    <v-layout row wrap style="flex: 0 0 auto;" class="full-width">
      
      <v-layout column class="pa-4 full-width">
        <div class="subheading half-bold pb-2">My Lists</div>
        <v-layout v-for="(list, i) in investmentPortfolio.lists" :key="'list-' + i" row justify-space-between class="py-1">
          <span style="text-transform: capitalize;"><span class="dot mr-1" :style="{ 'background-color': list.color }"></span>{{list.name}}</span>
          <span>{{list.researches.length}}</span>
        </v-layout>
        <v-btn @click="openNewListDialog()" round outline block large color="primary" class="new-list py-1 mt-3">
          <v-icon small left>add</v-icon>
          Add new list
        </v-btn>

        <v-dialog v-model="newList.isOpened" max-width="500px">
          <v-card>
            <v-card-title>
              <span>Add new list</span>
            </v-card-title>
            <v-card-text>
              <swatches v-model="newList.color" inline colors="material-light"/>
              <v-text-field 
                label="List name"
                v-model="newList.name" 
                :rules="[rules.required]"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-layout row justify-end>
                <v-btn flat @click="closeNewListDialog()">Cancel</v-btn>
                <v-btn @click="addNewList()" color="primary" :disabled="isSavingNewListDisabled || newList.isSaving">Save</v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout column class="py-2 full-width">
        <v-divider class="full-width"></v-divider>
        <div class="subheading half-bold px-4 py-2">Saved Search</div>
        <v-layout row justify-space-between v-for="(item, i) in savedSearchList" :key="'search-' + i" class="px-4">
          <a class="a" href="#">{{item.name}}</a>
        </v-layout>
      </v-layout>

      <v-layout column class="px-4 py-2 full-width">
        <div class="subheading half-bold pb-2">Saved Comparison</div>
        <v-layout row justify-space-between v-for="(item, i) in savedComparisonList" :key="'comparison-' + i">
          <a class="a" href="#">{{item.name}}</a>
        </v-layout>
      </v-layout>

    </v-layout>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Swatches from 'vue-swatches'
  import "vue-swatches/dist/vue-swatches.min.css"

  export default {
    name: 'InvestorDashboardInboxLeftSidebar',
    components: { 'swatches': Swatches },
    computed: {
      ...mapGetters({
        user: "auth/user",
        investmentPortfolio: "investorDashboard/investmentPortfolio",
      }),
      isSavingNewListDisabled() {
        return !this.newList.color || !this.newList.name;
      }
    },
    
    data() {
      return {
        newList: {
          name: "",
          color: "",
          isOpened: false,
          isSaving: false
        },

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
        ],

        rules: {
          required: value => !!value || 'This field is required'
        }
      }
    },

    methods: {
      openNewListDialog() {
        this.newList.color = "";
        this.newList.name = "";
        this.newList.isOpened = true;
      },

      closeNewListDialog() {
        this.newList.isOpened = false;
      },

      addNewList() {
        this.newList.isSaving = true;
        let name = this.newList.name.toLowerCase();
        let color = this.newList.color;
        this.$store.dispatch('investorDashboard/addNewInvestmentList', { name, color })
          .finally(() => {
            this.newList.isSaving = false;
            this.newList.isOpened = false;
          });
      }
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
