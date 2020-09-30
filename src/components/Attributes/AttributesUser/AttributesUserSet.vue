<template>
  <d-autocomplete
    v-if="$ready"
    v-model="internalValue"
    :label="attribute.title"
    :items="usersList"
    :item-text="userFullName"
    :item-value="userId"
    outlined
    hide-details="auto"
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
      <div class="d-inline-flex mr-4 align-center">
        <v-avatar size="24" class="mr-4">
          <img :src="item.profile | avatarSrc(2 * 24, 2 * 24, false)" />
        </v-avatar>
        {{ item | fullname }}
      </div>
    </template>
  </d-autocomplete>
</template>

<script>
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import AttributesCommonUsersSet from '@/components/Attributes/_partials/Set/AttributesCommonUsersSet';

  export default {
    name: 'AttributesUserSet',
    components: { DAutocomplete },
    mixins: [AttributesCommonUsersSet]
  };
</script>
