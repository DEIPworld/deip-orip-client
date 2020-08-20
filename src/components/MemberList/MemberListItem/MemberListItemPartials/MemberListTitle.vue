<template>
  <router-link
    :to="
      user.account.name === member.account.name
        ? {name: 'account.summary'}
        : { name: 'UserDetails', params: { account_name: member.account.name } }
    "
    tag="div"
    class="cursor-pointer"
  >
    <d-box-item
      :avatar="member.profile | avatarSrc(32, 32, false)"
      :size="32"
    >
      <v-clamp
        autoresize
        :max-lines="1"
        class="text-h6"
      >
        {{ member | fullname }}
      </v-clamp>
      <v-clamp
        autoresize
        :max-lines="descMaxLines"
        class="text-caption"
      >
        {{ member | employmentOrEducation }}
      </v-clamp>
    </d-box-item>
  </router-link>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { mapGetters } from 'vuex';

  export default {
    name: 'MemberListGroup',
    components: { DBoxItem },
    props: {
      member: {
        type: Object,
        default: () => ({})
      },
      descMaxLines: {
        type: [Number, String],
        default: 2
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    }
  };
</script>
