<template>
  <v-sheet tile class="pt-2">

    <router-view name="dialog"/>

    <v-toolbar class="px-2" flat>
      <v-toolbar-title class="headline">Members</v-toolbar-title>
      <v-spacer/>
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>person_add</v-icon>
        Add member
      </v-btn>
      <template #extension>
        <v-tabs v-model="tab">
          <v-tab>
            Registered
          </v-tab>
          <v-tab>
            Waiting for approval
            <v-badge content="7" color="green" inline/>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-divider />

    <v-tabs-items v-model="tab">
      <v-tab-item
        :transition="false"
        :reverse-transition="false"
      >
        <v-sheet class="pa-6">
          Registered
        </v-sheet>
      </v-tab-item>
      <v-tab-item

        :transition="false"
        :reverse-transition="false"
      >
        <v-sheet class="pa-6">
          Waiting for approval
        </v-sheet>
      </v-tab-item>
    </v-tabs-items>
  </v-sheet>
</template>

<script>
  export default {
    name: 'AdminMembers',
    data() {
      return {
        tab: null,
        dialogAddMember: null
      };
    }
  };
</script>

<style scoped>

</style>
