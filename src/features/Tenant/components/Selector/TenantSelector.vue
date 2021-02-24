<template>
  <d-autocomplete
    v-model="internalValue"

    :label="label"
    :items="tenantsList"

    item-text="profile.shortName"
    item-value="id"

    hide-details="auto"

    outlined
    chips
    deletable-chips

    v-bind="fieldProps"
  />
<!--  <d-autocomplete-->
<!--    ref="field"-->
<!--    v-model="internalValue"-->

<!--    :label="label"-->
<!--    :items="tenantsList"-->

<!--    item-text="name"-->
<!--    item-value="id"-->

<!--    hide-details="auto"-->

<!--    offset-y-->
<!--    offset-overflow-->

<!--    outlined-->

<!--    :name="label"-->
<!--    autocomplete="off"-->
<!--    :return-object="returnObject"-->

<!--    v-bind="fieldProps"-->

<!--    :loading="!$ready"-->
<!--  >-->
<!--    <template #item="{ item }">-->
<!--      <v-list-item-avatar :size="24">-->
<!--        <v-img :src="item | tenantLogoSrc(24)" />-->
<!--      </v-list-item-avatar>-->
<!--      <v-list-item-content class="text-body-2">-->
<!--        {{ item.profile.shortName }}-->
<!--      </v-list-item-content>-->
<!--    </template>-->

<!--    <template #selection="{ item }">-->
<!--      <v-chip-->
<!--        v-if="multiple"-->
<!--        :disabled="disabled"-->
<!--        outlined-->
<!--      >-->
<!--        <v-avatar left class="mr-2 ml-n2">-->
<!--          <v-img :src="item | tenantLogoSrc(24)" />-->
<!--        </v-avatar>-->

<!--        <div class="text-truncate spacer">-->
<!--          {{ item.profile.shortName }}-->
<!--        </div>-->

<!--        <v-btn-->
<!--          icon-->
<!--          x-small-->
<!--          class="mr-n2 ml-2"-->
<!--          @click="$refs.field.onChipInput(item)"-->
<!--        >-->
<!--          &lt;!&ndash;          @click="remove(item)" &ndash;&gt;-->
<!--          <v-icon>clear</v-icon>-->
<!--        </v-btn>-->
<!--      </v-chip>-->

<!--      <div v-else class="d-inline-flex mr-4 align-center" style="max-width: calc(100% - 80px)">-->
<!--        <v-avatar size="24" class="mr-2">-->
<!--          <img :src="item | tenantLogoSrc(24)" alt="">-->
<!--        </v-avatar>-->
<!--        <div class="text-truncate">-->
<!--          {{ item.profile.shortName }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
<!--  </d-autocomplete>-->
</template>

<script>
  import Validatable from 'vuetify/lib/mixins/validatable';
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  import { componentStoreFactoryOnce } from '@/mixins/registerStore';

  import { mapState } from 'vuex';
  import { wrapInArray } from 'vuetify/lib/util/helpers';
  import { hasValue } from '@/utils/helpers';

  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';
  import { tenantsListStore } from '@/features/Tenant/store/tenantsListStore';

  export default {
    name: 'TenantSelector',
    components: { DAutocomplete },
    mixins: [
      Proxyable,
      componentStoreFactoryOnce(tenantsListStore, 'Tenants')
    ],

    props: {
      label: {
        type: String,
        default: 'Select tenant'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      returnObject: {
        type: Boolean,
        default: false
      },

      exclude: {
        type: [Array, String],
        default: () => ([])
      },
      filter: { // temp solution
        type: Object,
        default: () => ({})
      },

      ...Validatable.options.props
    },

    computed: {
      ...mapState({
        rawTenantsList(state, getters) { return getters['Tenants/list'](); }
      }),

      tenantsList() {
        if (hasValue(this.filter)) {
          return this.$where(this.rawTenantsList, this.filter);
        }
        return this.rawTenantsList;
      },

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
          ...this.validatableProps,
          disabled: !this.$ready || this.validatableProps.disabled
        };
      }
    },

    created() {
      this.loadTenants();
    },

    methods: {
      loadTenants() {
        this.$setReady(false);

        this.$store.dispatch('Tenants/fetch')
          .then(() => {
            this.$setReady();
            this.$emit('ready', this.usersList);
          });
      }

      // unwrapUser(wrap) {
      //   let user;
      //   if (Array.isArray(wrap)) {
      //     user = wrap[0];
      //   } else {
      //     user = wrap;
      //   }
      //
      //   if (typeof user === 'string') {
      //     return this.usersList.find(u => u.username == user);
      //   }  else {
      //     return user;
      //   }
      // },
      //
      // userFullName(wrap) {
      //   const user = this.unwrapUser(wrap);
      //   return this.$options.filters.accountFullname(user);
      // },
      //
      // userExternalId(wrap) {
      //   const user = this.unwrapUser(wrap);
      //   return user.account.name;
      // }
    }
  };
</script>
