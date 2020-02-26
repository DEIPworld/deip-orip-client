<template>
  <div>
    <div class="display-flex justify-space-between align-center">
      <div class="title">
        {{ !headerText ? 'Projects' : headerText }}
      </div>

      <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn class="ma-0" v-on="on">
            <div>
              {{ sort[sort.type] }}
              <v-icon class="c-pl-4" small>
                keyboard_arrow_down
              </v-icon>
            </div>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="sort.type = 'newest'">
            <v-list-item-title>Newest First</v-list-item-title>
          </v-list-item>

          <v-list-item @click="sort.type = 'oldest'">
            <v-list-item-title>Oldest First</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="c-pt-5">
      <v-tabs v-model="tab">
        <v-tab href="#active" :class="themeSettings['tabs-text-class']" :disabled="activeResearchList.length === 0">
          Active: {{ activeResearchList.length }}
        </v-tab>

        <v-tab href="#finished" :class="themeSettings['tabs-text-class']" :disabled="finishedResearchList.length === 0">
          Finished: {{ finishedResearchList.length }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="margin: 0px -2px -3px;">
        <v-tab-item value="active">
          <v-card>
            <v-row style="margin: 0px 2px 3px;">
              <v-col
                v-for="({research, group }, i) in activeResearchList"
                :key="`${i}-research`"
                class="ckass"
                cols="12"
                sm="6"
                lg="4"
              >
                <research-project-tile
                  :research="research"
                  :group="group"
                  :members="research.members"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card v-if="!activeResearchList.length" text>
            <v-card-text>There is no active research at the moment</v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item value="finished">
          <v-card>
            <v-row style="margin: 0px 2px 3px;">
              <v-col
                v-for="({research, group }, i) in finishedResearchList"
                :key="`${i}-finished-research`"
                cols="12"
                sm="6"
                xl="4"
              >
                <research-project-tile
                  :research="research"
                  :group="group"
                  :members="research.members"
                />
              </v-col>
            </v-row>
          </v-card>

          <v-card v-if="!finishedResearchList.length" text>
            <v-card-text>Finished research list is empty at the moment</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  export default {
    name: 'StateResearchList',
    props: {
      researchList: {
        required: true,
        type: Array
      },
      headerText: {
        required: false,
        type: String
      }
    },
    data() {
      return {
        tab: 'active',
        sort: {
          type: 'newest',
          newest: 'Newest First',
          oldest: 'Oldest First'
        }
      };
    },
    computed: {
      ...mapGetters({
        themeSettings: 'layout/themeSettings'
      }),
      finishedResearchList() {
        if (this.sort.type === 'newest') {
          return this.researchList.filter(({ research }) => research.is_finished).sort((a, b) => {
            const dateA = new Date(a.research.created_at);
            const dateB = new Date(b.research.created_at);
            return dateB - dateA;
          });
        } else if (this.sort.type === 'oldest') {
           return this.researchList.filter(({ research }) => research.is_finished).sort((a, b) => {
            const dateA = new Date(a.research.created_at);
            const dateB = new Date(b.research.created_at);
            return dateA - dateB;
          });
        } else {
          return this.researchList.filter(({ research }) => research.is_finished).sort((a, b) => {
            const dateA = new Date(a.research.created_at);
            const dateB = new Date(b.research.created_at);
            return dateA - dateB;
          });
        }
      },
      activeResearchList() {
        if (this.sort.type === 'newest') {
          return this.researchList.filter(({ research }) => !research.is_finished).sort((a, b) => {
            const dateA = new Date(a.research.created_at);
            const dateB = new Date(b.research.created_at);
            return dateB - dateA;
          });
        } else if (this.sort.type === 'oldest') {
          return this.researchList.filter(({ research }) => !research.is_finished).sort((a, b) => {
            const dateA = new Date(a.research.created_at);
            const dateB = new Date(b.research.created_at);
            return dateA - dateB;
          });
        } else {
          return this.researchList.filter(({ research }) => !research.is_finished);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
