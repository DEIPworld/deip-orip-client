<template>
  <d-autocomplete
    v-if="$ready"
    v-model="internalValue"
    :label="attribute.title"
    :items="usersList"
    :item-text="userFullName"
    :item-value="userId"
    hide-details="auto"
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
        outlined
        style="max-width:100%"
      >
        <v-avatar left style="margin-left: -8px;">
          <img :src="item.profile | avatarSrc(2 * 24, 2 * 24, false)" />
        </v-avatar>

        <div class="text-truncate spacer">
          {{ item | fullname }}
        </div>

        <v-btn
          icon
          x-small
          class="mr-n2 ml-2"
          @click="remove(item)"
        >
          <v-icon>clear</v-icon>
        </v-btn>
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
    mixins: [AttributesCommonUsersSet],
    methods: {
      remove(item) {
        const idx = this.internalValue.indexOf(this.userId(item));
        if (idx !== -1) {
          this.internalValue.splice(idx, 1);
          this.internalValue = [...new Set(this.internalValue)];
        }
      }
    }
  };
</script>
