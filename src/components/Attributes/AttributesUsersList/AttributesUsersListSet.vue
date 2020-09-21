<template>
  <d-autocomplete
    v-if="$ready"
    v-model="internalValue"
    :label="attribute.title"
    :items="usersList"
    :item-text="userFullName"
    :item-value="userId"
    outlined
    multiple
  >
    <template #item="{ item }">
      <v-list-item-avatar :size="24">
        <img :src="item.profile | avatarSrc(2 * 24, 2 * 24, false)" />
      </v-list-item-avatar>
      <v-list-item-content class="ttext-body-2">
        {{ item | fullname }}
      </v-list-item-content>
    </template>

    <template #selection="{ item }">
      <v-chip
        close
        close-icon="clear"
        outlined
      >
        <v-avatar left style="margin-left: -8px;">
          <img :src="item.profile | avatarSrc(2 * 24, 2 * 24, false)" />
        </v-avatar>
        {{ item | fullname }}
      </v-chip>
    </template>
  </d-autocomplete>
</template>

<script>
  import AttributesCommonUsersSet from '@/components/Attributes/_partials/Set/AttributesCommonUsersSet';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesUsersListSet',
    components: { DAutocomplete },
    mixins: [AttributesCommonUsersSet]
  };
</script>
