<template>
  <div>
    table
  </div>
</template>

<script>
  import { usersList } from '@/features/Users/mixins';

  export default {
    name: 'UsersListDefault',
    mixins: [usersList]
  };
</script>
