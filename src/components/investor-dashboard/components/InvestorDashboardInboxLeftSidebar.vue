<template>
  <v-card height="100%">
    <v-layout row wrap style="flex: 0 0 auto;" class="full-width">
      
      <v-layout column class="py-4 full-width">
        <div class="subheading half-bold pb-2 px-4">My Lists</div>
        <v-layout row v-for="(list, i) in lists" @click="selectList(list)" :key="'list-' + i" class="list py-1" :class="{'selected': list === selectedList}">
          <v-layout row justify-space-between class="px-4">
            <span><span class="dot mr-1" :style="{ 'background-color': list.color }"></span>{{list.name}}</span>
            <span>{{ list.listResearchesIds.length }}</span>
          </v-layout>
        </v-layout>
        <div class="mt-2 px-4">
          <v-layout row justify-space-between>
            <v-flex :class="{'xs5': isCustomListSelected}">
              <v-btn @click="openNewListDialog()" block round outline small color="primary" class="new-list-btn mx-0 my-2">
                <v-icon left small>add</v-icon>
                {{isCustomListSelected ? 'Add' : 'Add new list'}}
              </v-btn>
            </v-flex>
            <v-flex @click="openEditListDialog()" v-if="isCustomListSelected" xs5>
              <v-btn block round outline small color="primary" class="new-list-btn mx-0 my-2">
                <v-icon left small>edit</v-icon>
                Edit
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
        <v-dialog v-model="newListDialog.isOpened" max-width="600px">
          <v-card>
            <v-card-title>
              <v-layout align-center>
                <v-flex grow>
                  Add new list
                </v-flex>
                <v-flex shrink>
                  <v-btn @click="closeNewListDialog()" icon class="pa-0 ma-0">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text>
              <swatches v-model="newListDialog.color" inline colors="material-light"/>
              <v-text-field 
                label="List name"
                v-model="newListDialog.name" 
                :rules="[rules.required]"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-layout row justify-end>
                <v-btn flat @click="closeNewListDialog()">Cancel</v-btn>
                <v-btn @click="addNewList()" color="primary" :disabled="isSavingNewListDisabled || newListDialog.isSaving">Save</v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="editListDialog.isOpened" max-width="600px">
          <v-card>
            <v-card-title>
              <v-layout align-center>
                <v-flex grow>Add new list</v-flex>
                <v-flex shrink>
                  <v-btn @click="closeEditListDialog()" icon class="pa-0 ma-0">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text>
              <swatches v-model="editListDialog.color" inline colors="material-light"/>
              <v-text-field 
                label="List name"
                v-model="editListDialog.name" 
                :rules="[rules.required]"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-layout row justify-end>
                <v-btn flat @click="closeEditListDialog()">Cancel</v-btn>
                <v-btn @click="editCustomList()" color="primary" :disabled="isSavingEditedListDisabled || editListDialog.isSaving">Save</v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout column class="py-2 full-width">
        <v-divider class="full-width"></v-divider>
        <div class="subheading half-bold px-4 py-2">Saved Search</div>
        <v-layout row justify-space-between v-for="(item, i) in savedSearchList" :key="'search-' + i" class="px-4">
          <a class="a" @click="showUnderDevelopmentAlert()">{{item.name}}</a>
        </v-layout>
      </v-layout>

      <v-layout column class="px-4 py-2 full-width">
        <div class="subheading half-bold pb-2">Saved Comparison</div>
        <v-layout row justify-space-between v-for="(item, i) in savedComparisonList" :key="'comparison-' + i">
          <a class="a" @click="showUnderDevelopmentAlert()">{{item.name}}</a>
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
        lists: "investorDashboard/lists",
        selectedList: "investorDashboard/selectedList"
      }),
      isSavingNewListDisabled() {
        return !this.newListDialog.color || !this.newListDialog.name;
      },
      isSavingEditedListDisabled() {
        return !this.editListDialog.color || !this.editListDialog.name;
      },
      isCustomListSelected() {
        return this.selectedList.id != 'all';
      }
    },
    
    data() {
      return {
        newListDialog: {
          name: "",
          color: "",
          isOpened: false,
          isSaving: false
        },
        editListDialog: {
          id: "",
          name: "",
          color: "",
          isOpened: false,
          isSaving: false
        },

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
      selectList(list) {
        this.$store.dispatch('investorDashboard/selectList', list.id);
      },

      openNewListDialog() {
        this.newListDialog.color = "";
        this.newListDialog.name = "";
        this.newListDialog.isOpened = true;
      },

      closeNewListDialog() {
        this.newListDialog.isOpened = false;
      },

      addNewList() {
        this.newListDialog.isSaving = true;
        let listName = this.newListDialog.name;
        let listId = `${listName.replace(/ /g, "-").replace(/_/g, "-").toLowerCase()}-${new Date().getTime()}`;
        let color = this.newListDialog.color;
        this.$store.dispatch('investorDashboard/addNewInvestmentList', { listId, listName, color })
          .finally(() => {
            this.newListDialog.isSaving = false;
            this.newListDialog.isOpened = false;
          });
      },

      openEditListDialog() {
        this.editListDialog.id = this.selectedList.id;
        this.editListDialog.color = this.selectedList.color;
        this.editListDialog.name = this.selectedList.name;
        this.editListDialog.isOpened = true;
      },

      closeEditListDialog() {
        this.editListDialog.isOpened = false;
      },

      editCustomList() {
        this.editListDialog.isSaving = true;
        let listId = this.editListDialog.id;
        let listName = this.editListDialog.name;
        let color = this.editListDialog.color;
        this.$store.dispatch('investorDashboard/editInvestmentList', { listId, listName, color })
          .finally(() => {
            this.editListDialog.isSaving = false;
            this.editListDialog.isOpened = false;
          });
      },

      showUnderDevelopmentAlert() {
        alert('This feature is under development');
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

.new-list-btn {
  text-transform: none;
  max-height: 30px;
}

.list {
  cursor: pointer !important;

  &:hover{
    background-color: var(--v-secondary-lighten2);
  }
  &.selected {
    background-color: var(--v-primary-lighten5);
  }
}

</style>
