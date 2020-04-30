<template>
  <admin-view title="Members">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>
          person_add
        </v-icon>
        Add member
      </v-btn>
    </template>

    <template #toolbarExtension>
      <v-tabs v-model="tab" class="mx-n4">
        <v-tab>
          Registered
        </v-tab>
        <v-tab>
          Waiting for approval
          <v-badge content="7" color="green" inline />
        </v-tab>
      </v-tabs>
    </template>

    <v-tabs-items v-model="tab">
      <v-tab-item
        :transition="false"
        :reverse-transition="false"
      >
        Registered
      </v-tab-item>

      <v-tab-item
        :transition="false"
        :reverse-transition="false"
      >
        Waiting for approval
      </v-tab-item>
    </v-tabs-items>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';

  export default {
    name: 'AdminMembers',
    components: { AdminView },
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
