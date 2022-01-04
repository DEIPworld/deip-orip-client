<template>
  <v-row class="mx-0 fill-height domain-picker overflow-y-auto">
    <v-col v-if="!withoutUserDomains" class="xs4 pa-4 overflow-y-auto">
      <div class="pb-4 bold uppercase">
        {{ $t('defaultNaming.yourDomain') }}
      </div>

      <v-list
        v-if="userDomains.length"
        class="pa-0"
        dense
        nav
      >
        <v-list-item-group>
          <v-list-item
            v-for="(domain, i) in userDomains"
            :key="i"
            :input-value="isUserLabelSelected(domain)"
            @click="handleUserDomain(domain)"
          >
            {{ domain.name }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>

    <v-col class="pa-4 fill-height overflow-y-auto" :cols="!withoutUserDomains ? '8' : '12'">
      <div class="pb-4 bold uppercase">
        {{ $t('defaultNaming.allDomain') }}
      </div>

      <domain-tree-picker
        :is-multiple-select="isMultipleSelect"
        :is-highlighted-parent="isHighlightedParent"
        :preselected="preselected"
        @select="select"
      />
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'AdvancedDomainPicker',

    props: {
      isMultipleSelect: {
        type: Boolean,
        required: false,
        default: true
      },
      isHighlightedParent: {
        type: Boolean,
        required: false,
        default: false
      },

      withoutUserDomains: {
        type: Boolean,
        required: false,
        default: false
      },

      preselected: {
        validator(value) {
          return value === undefined || typeof value === 'array' || typeof value === 'object';
        },
        required: true
      }
    },

    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),

      userDomains() {
        return this.$store.getters['Domains/list'](
          { _id: [this.user.expertTokens.map((token) => token.domainId)] }
        );
      }
    },

    methods: {
      select(selected) {
        this.$emit('select', selected);
      },

      handleUserDomain(domain) {
        if (!this.isMultipleSelect) {
          this.$emit('select', domain);
        } else {
          const preselectedCopy = _.cloneDeep(this.preselected);

          if (!_.find(preselectedCopy, (item) => item.id === domain._id)) {
            preselectedCopy.push(domain);
          } else {
            _.remove(preselectedCopy, (item) => item.id === domain._id);
          }

          this.$emit('select', preselectedCopy);
        }
      },

      isUserLabelSelected(domain) {
        if (!this.isMultipleSelect) {
          return !!this.preselected && this.preselected.id === domain._id;
        }
        return !!_.find(this.preselected, (item) => item.id === domain._id);
      }
    }
  };
</script>

<style lang="less" scoped>
  .domain-picker {
    border: 1px solid #E0E0E0;

    & > :not(:last-child) {
      border-right: 1px solid #E0E0E0;
    }
  }
</style>
