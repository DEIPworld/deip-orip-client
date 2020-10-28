<template>
  <d-autocomplete
    v-if="$ready"
    v-model="internalValue"

    :label="attribute.title"
    :items="usersList"

    :item-text="userFullName"
    :item-value="userId"

    hide-details="auto"

    offset-y
    offset-overflow

    outlined

    v-bind="isMultipleProps"
  >

    <template #item="{ item }">
      <v-list-item-avatar :size="24">
        <img :src="item.profile | avatarSrc(24)" />
      </v-list-item-avatar>
      <v-list-item-content class="ttext-body-2">
        {{ item | fullname }}
      </v-list-item-content>
    </template>


    <template #selection="{ item }">

      <v-chip
        v-if="isMultiple"
        outlined
      >
        <v-avatar left class="mr-2 ml-n2">
          <img :src="item.profile | avatarSrc(24)" alt="">
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

      <div v-else class="d-inline-flex mr-4 align-center">
        <v-avatar size="24" class="mr-2">
          <img :src="item.profile | avatarSrc(24)" alt="">
        </v-avatar>
        {{ item | fullname }}
      </div>

    </template>

  </d-autocomplete>
</template>

<script>
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersStore } from '@/components/Users/store';
  import { attributeSetForceArray } from '@/components/Attributes/_mixins';
  import { mapState } from 'vuex';

  export default {
    name: 'AttributesUsersListSet',
    components: { DAutocomplete },
    // mixins: [AttributesCommonUsersSet, arrayedModel],
    mixins: [componentStoreFactory(usersStore), attributeSetForceArray],

    props: {
      users: {
        type: Array,
        default: () => ([])
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/list`]; }
      }),

      isMultiple() {
        return this.multiple || this.attribute.isMultiple;
      },

      isMultipleProps() {
        return {
          multiple: this.isMultiple
        };
      }
    },

    created() {
      if (this.users.length) {
        this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, this.users)
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$store.dispatch(`${this.storeNS}/getActiveUsers`, this.users)
          .then(() => {
            this.$setReady();
          });
      }
    },

    methods: {
      userFullName(e) {
        return e.profile ? this.$options.filters.fullname(e) : 'undefined'
      },

      userId(e) {
        return e.profile ? e.profile._id : 'undefined';
      },

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
