<template>
  <validation-provider
    v-slot="{ errors }"
    :name="attribute.title"
    :rules="$$isRequired ? $$rules : null"
  >
    <user-selector
      v-model="internalValue"
      :label="$$label"
      :error-messages="errors"
      :disabled="!$$isEditable"
      :multiple="attribute.isMultiple"
      :tenant-id="$env.TENANT"
      :filter="researchesFilter"
    />
  </validation-provider>
</template>

<script>
  import { attributeSetForceArray } from '@/components/Attributes/_mixins';
  import { mapGetters } from 'vuex';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  export default {
    name: 'AttributesUsersListSet',
    components: { UserSelector },
    mixins: [attributeSetForceArray],
    computed: {
      ...mapGetters({
        tenantResearchersGroup: 'auth/tenantResearchersGroup'
      })
    },
    methods: {
      researchesFilter(user) {
        return user.profile.roles.some(({ role }) => role === 'team-member') && this.tenantResearchersGroup.members.some(member => member.username === user.username);
      }
    }
  };
</script>
