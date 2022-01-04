<template>
  <user-details-renderer
    :schema="layoutSchema"

    :user="user"
  />
</template>

<script>
  import UserDetailsRenderer from '@/features/Users/components/User/Details/renderer';
  import { extendAttrModules, portalAttributesToObject } from '@/utils/helpers';
  import { collectionMerge } from '@deip/toolbox';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'UserDetails',
    components: { UserDetailsRenderer },
    mixins: [attributesChore],
    computed: {
      layoutSchema() {
        const schema = this.$portalSettings.layouts.userDetails.layout;
        return extendAttrModules(
          schema,
          {
            attrs: {
              user: _.cloneDeep({ profile: { ...this.user.profile } }),
              username: this.user.username
            }
          }
        );
      },

      user() {
        const user = this.$route.params.account_name ? this.$store.getters['Users/one'](this.$route.params.account_name) : this.$currentUser;

        const allAttrs = this.$$userAttributes
          .map((attr) => ({
            attributeId: attr._id,
            value: attr.defaultValue
          }));

        const constructedAttrs = collectionMerge(
          allAttrs,
          user.profile.attributes,
          { key: 'attributeId' }
        );
        return {
          ...user,
          ...{
            profile: {
              ...user.profile,
            attributes: portalAttributesToObject(constructedAttrs),
            createdAt: this.$options.filters.dateFormat(user.profile.created_at, 'D MMM YYYY', true)
            }
          },
          bracketUsername: `(${user.username})`,
          domains: user.expertise.map((e) => ({
            name: e.domainName, _id: e.domainId
          }))
        };
      }
    }
  };
</script>
