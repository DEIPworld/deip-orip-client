<template>
  <d-autocomplete
    ref="field"
    v-model="internalValue"

    :label="label"
    :items="usersList"

    :item-text="userFullName"
    :item-value="userExternalId"

    hide-details="auto"

    offset-y
    offset-overflow

    outlined

    :name="label"
    autocomplete="off"
    :return-object="returnObject"

    v-bind="fieldProps"
  >
    <template #item="{ item }">
      <v-list-item-avatar :size="24">
        <v-img :src="item.profile | avatarSrc(24)" />
      </v-list-item-avatar>
      <v-list-item-content class="text-body-2">
        {{ userFullName(item) }}
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
          {{ userFullName(item) }}
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

      <div v-else class="d-inline-flex mr-4 align-center" style="max-width: calc(100% - 80px)">
        <v-avatar size="24" class="mr-2">
          <img :src="item.profile | avatarSrc(24)" alt="">
        </v-avatar>
        <div class="text-truncate">
          {{ userFullName(item) }}
        </div>
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
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';
  import { wrapInArray } from 'vuetify/lib/util/helpers';

  export default {
    name: 'UserSelector',
    components: { DAutocomplete },
    mixins: [
      Proxyable,
      componentStoreFactory(usersListStore),
      dataContextSwitch
    ],

    props: {
      label: {
        type: String,
        default: 'Select members'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      returnObject: {
        type: Boolean,
        default: false
      },

      users: {
        type: [Array, String],
        default: () => ([])
      },
      exclude: {
        type: [Array, String],
        default: () => ([])
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

        this.$store.dispatch(`${this.storeNS}/getUsersList`, {
          users: wrapInArray(this.users),
          exclude: this.exclude,
          ...this.$$dataContextProps
        })
          .then(() => {
            this.$setReady();
            this.$emit('ready', this.usersList);
          });
      },

      userFullName(e) {

        if (e.teamRef) {
          return e.teamRef.name;
        }

        if (e.profile) {
          return this.$options.filters.fullname(e);
        }

        return 'undefined';
      },

      userExternalId(e) {

        if (e.account && e.account.is_research_group) {
          return e.account.name;
        }

        if (e.profile) {
          return e.profile._id;
        }

        return e;
      }
    }
  };
</script>
