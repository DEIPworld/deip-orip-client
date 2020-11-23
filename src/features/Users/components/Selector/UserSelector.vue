<template>
  <d-autocomplete
    v-if="$ready"
    ref="field"
    v-model="internalValue"

    :label="label"
    :items="usersList"

    :item-text="userFullName"
    :item-value="userId"

    hide-details="auto"

    offset-y
    offset-overflow

    outlined

    :name="label"
    autocomplete="off"

    v-bind="fieldProps"
  >
    <template #item="{ item }">
      <v-list-item-avatar :size="24">
        <v-img :src="item.profile | avatarSrc(24)" />
      </v-list-item-avatar>
      <v-list-item-content class="ttext-body-2">
        {{ item | fullname }}
      </v-list-item-content>
    </template>

    <template #selection="{ item }">
      <v-chip
        v-if="multiple"
        :disabled="disabled"
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
          @click="$refs.field.onChipInput(item)"
        >
          <!--          @click="remove(item)" -->
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
  import Validatable from 'vuetify/lib/mixins/validatable';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { componentStoreFactory } from '@/mixins/registerStore';
  import { usersListStore } from '@/features/Users/store';
  import { mapState } from 'vuex';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'UserSelector',
    components: { DAutocomplete },
    mixins: [
      Proxyable,
      componentStoreFactory(usersListStore)
    ],

    props: {
      label: {
        type: String,
        default: 'Select members'
      },
      users: {
        type: Array,
        default: () => ([])
      },
      multiple: {
        type: Boolean,
        default: false
      },

      ...Validatable.options.props
    },
    computed: {
      ...mapState({
        usersList(state, getters) { return getters[`${this.storeNS}/usersList`]; }
      }),

      isMultipleProps() {
        return {
          multiple: this.multiple
        };
      },

      validatableProps() {
        return Object.keys(Validatable.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      },

      fieldProps() {
        return {
          ...this.isMultipleProps,
          ...this.validatableProps
        };
      }
    },

    created() {
      this.loadUsers();
    },

    methods: {
      loadUsers() {
        this.$setReady(false);

        console.log(this.users)

        const loadUsers = this.users.length
          ? this.$store.dispatch(`${this.storeNS}/getUsersProfiles`, this.users)
          : this.$store.dispatch(`${this.storeNS}/getActiveUsers`, this.users);

        loadUsers.then(() => {
          this.$setReady();
        });
      },

      userFullName(e) {
        return e.profile ? this.$options.filters.fullname(e) : 'undefined';
      },

      userId(e) {
        return e.profile ? e.profile._id : 'undefined';
      }
    }
  };
</script>
