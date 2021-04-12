<template>
  <v-btn
    small
    icon
    :to="{
      name: 'account.profile',
      params: {
        account_name: user.username
      }
    }"
  >
    <v-icon>edit</v-icon>
  </v-btn>
</template>

<script>
  import { userDetails } from '@/features/Users/mixins/userDetails';

  export default {
    name: 'ResearchDetailsEditCta',
    mixins: [userDetails]
  };
</script>
