<template>
  <layout-section>
    <teams-list :username="$currentUser.username" common />
  </layout-section>
</template>

<script>
  import TeamsList from '@/features/Teams/components/List/TeamsList';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'AccountGroups',
    components: { TeamsList, LayoutSection }
  };
</script>
