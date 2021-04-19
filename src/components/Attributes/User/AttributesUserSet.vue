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
  import UserSelector from '@/features/Users/components/Selector/UserSelector';

  export default {
    name: 'AttributesUsersListSet',
    components: { UserSelector },
    mixins: [attributeSetForceArray],
    methods: {
      researchesFilter(user) {
        return user.profile.roles.some(({ role }) => role === 'team-member') && user.teams.some(teamId => teamId === "fc712435c8d6d4ce569ba49b4c8cb07441e5aa65");
      }
    }
  };
</script>
