<template>
  <v-navigation-drawer app clipped :key="$route.fullPath + '-sidebar'">
    <div class="pa-6">
      <div class="text-h6">
        My Lists
      </div>
      <v-list
        dense
        nav
        class="mx-n2 mb-6"
      >
        <v-list-item
          v-for="(list, i) in lists"
          :key="'list-' + i"
          :input-value="list === selectedList"
          @click="selectList(list)"
        >
          <span class="dot mx-2" :style="{ 'background-color': list.color }" />
          <v-list-item-content>
            <v-list-item-title v-text="list.name" />
          </v-list-item-content>
          <v-chip small outlined>
            {{ list.listResearchesIds.length }}
          </v-chip>
        </v-list-item>
      </v-list>

      <v-btn
        outlined
        small
        color="primary"
        class="mr-2"
        @click="openNewListDialog()"
      >
        <v-icon left small>
          add
        </v-icon>
        {{ isCustomListSelected ? 'Add' : 'Add new list' }}
      </v-btn>

      <v-btn
        v-if="isCustomListSelected"
        outlined
        small
        color="primary"
        @click="openEditListDialog()"
      >
        <v-icon left small>
          edit
        </v-icon>
        Edit
      </v-btn>

      <v-dialog v-model="newListDialog.isOpened" max-width="600px">
        <v-card class="pa-6">
          <v-card-title>
            <div class="text-h6">
              Add new list
            </div>
            <div class="right-top-angle">
              <v-btn icon class="pa-0 ma-0" @click="closeNewListDialog()">
                <v-icon color="black">
                  close
                </v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <swatches v-model="newListDialog.color" inline colors="material-light" />
            <v-text-field
              v-model="newListDialog.name"
              outlined
              label="List name"
              :rules="[rules.required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col class="py-2" cols="12">
                <v-btn
                  color="primary"
                  block
                  :disabled="isSavingNewListDisabled || newListDialog.isSaving"
                  @click="addNewList()"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col class="py-2" cols="12">
                <v-btn
                  color="primary"
                  text
                  block
                  @click="closeNewListDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editListDialog.isOpened" max-width="600px">
        <v-card class="pa-6">
          <v-card-title>
            <div class="text-h6">
              Add new list
            </div>
            <div class="right-top-angle">
              <v-btn icon class="pa-0 ma-0" @click="closeEditListDialog()">
                <v-icon color="black">
                  close
                </v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <swatches v-model="editListDialog.color" inline colors="material-light" />
            <v-text-field
              v-model="editListDialog.name"
              outlined
              label="List name"
              :rules="[rules.required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col class="py-2" cols="12">
                <v-btn
                  color="primary"
                  block
                  :disabled="isSavingEditedListDisabled || editListDialog.isSaving"
                  @click="editCustomList()"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col class="py-2" cols="12">
                <v-btn
                  color="primary"
                  text
                  block
                  @click="closeEditListDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-divider class="my-6" />

      <v-list dense>
        <v-subheader>Saved Search</v-subheader>
        <v-list-item
          v-for="(item, i) in savedSearchList"
          :key="'search-' + i"
          @click="showUnderDevelopmentAlert()"
        >
          <v-list-item-title v-text="item.name" />
        </v-list-item>
      </v-list>

      <v-list dense>
        <v-subheader>Saved Comparison</v-subheader>
        <v-list-item
          v-for="(item, i) in savedComparisonList"
          :key="'comparison-' + i"
          @click="showUnderDevelopmentAlert()"
        >
          <v-list-item-title v-text="item.name" />
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Swatches from 'vue-swatches';
  import 'vue-swatches/dist/vue-swatches.min.css';

  export default {
    name: 'InvestorPortfolioInboxLeftSidebar',
    components: {
      swatches: Swatches
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        investmentPortfolio: 'investorPortfolio/investmentPortfolio',
        lists: 'investorPortfolio/lists',
        selectedList: 'investorPortfolio/selectedList'
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
          name: '',
          color: '',
          isOpened: false,
          isSaving: false
        },
        editListDialog: {
          id: '',
          name: '',
          color: '',
          isOpened: false,
          isSaving: false
        },

        savedSearchList: [
          {
            name: 'Belarus',
            query: ''
          },
          {
            name: '11.09.2018',
            query: ''
          },
          {
            name: 'Undiscovered',
            query: ''
          },
          {
            name: 'Physics',
            query: ''
          },
          {
            name: 'Popular',
            query: ''
          },
          {
            name: 'Medicine & Health',
            query: ''
          }
        ],

        savedComparisonList: [
          {
            name: '11.10.2018 Computer science',
            query: ''
          },
          {
            name: 'Reviewed research',
            query: ''
          }
        ],

        rules: {
          required: (value) => !!value || 'This field is required'
        }
      };
    },

    methods: {
      selectList(list) {
        this.$store.dispatch('investorPortfolio/selectList', list.id);
      },

      openNewListDialog() {
        this.newListDialog.color = '';
        this.newListDialog.name = '';
        this.newListDialog.isOpened = true;
      },

      closeNewListDialog() {
        this.newListDialog.isOpened = false;
      },

      addNewList() {
        this.newListDialog.isSaving = true;
        const listName = this.newListDialog.name;
        const listId = `${listName.replace(/ /g, '-')
          .replace(/_/g, '-')
          .toLowerCase()}-${new Date().getTime()}`;
        const { color } = this.newListDialog;
        this.$store.dispatch('investorPortfolio/addNewInvestmentList', {
          listId,
          listName,
          color
        })
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
        const listId = this.editListDialog.id;
        const listName = this.editListDialog.name;
        const { color } = this.editListDialog;
        this.$store.dispatch('investorPortfolio/editInvestmentList', {
          listId,
          listName,
          color
        })
          .finally(() => {
            this.editListDialog.isSaving = false;
            this.editListDialog.isOpened = false;
          });
      },

      showUnderDevelopmentAlert() {
        alert('This feature is under development');
      }
    }
  };
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

    &:hover {
      background-color: var(--v-secondary-lighten2);
    }

    &.selected {
      background-color: var(--v-primary-lighten5);
    }
  }

</style>
