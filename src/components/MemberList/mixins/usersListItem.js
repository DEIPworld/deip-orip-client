import { componentsRenderer } from '@/mixins/renderer';
import { AccessService } from '@deip/access-service';

import AttributesRead from '@/components/Attributes/AttributesRead';
import { extendAttrModules, hasValue, portalAttributesToObject } from '@/utils/helpers';
import { collectionMerge } from '@deip/toolbox';
import { attributesChore } from '@/mixins/chores/attributesChore';

const accessService = AccessService.getInstance();

export const UsersListItemRenderer = {
  name: 'UsersListItemRenderer',
  components: {
    AttributesRead
  },
  mixins: [componentsRenderer],
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    ifAttribute(id) {
      const attr = this.user.profile.attributes[id];

      if (!attr || !attr.value) return false;

      return hasValue(attr.value);
    },
    commaNumber(value, separator = ',') {
      if (!value && value !== 0) return '';
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },
    numDir(value) {
      if (!value) return '';
      return parseFloat(value) >= 0 ? `+${value}` : value;
    },

    numDirClass(value, type = 'foreground') {
      if (!value || parseFloat(value) === 0) return '';

      if (type === 'background') {
        return parseFloat(value) > 0
          ? 'success lighten-3'
          : 'error lighten-3';
      }

      return parseFloat(value) > 0
        ? 'success--text'
        : 'error--text';
    },

    locationInfo(city, country) {
      return `${this.user.profile.attributes[city].value || ''} ${this.user.profile.attributes[country].value || ''}`;
    },
    fullName(firstName, secondName) {
      if (!(firstName || secondName)) return this.user.username;
      return `${this.user.profile.attributes[firstName].value || ''} ${this.user.profile.attributes[secondName].value || ''}`;
    },
    avatarSrc(username, width = 48, height, isRound = false, noCache = false) {
      const internalWidth = width * 2;
      const internalHeight = height ? height * 2 : internalWidth;
      const profileId = username || 'initdelegate';

      const pathArray = [
        window.env.DEIP_SERVER_URL,
        '/api/user/avatar/',
        profileId,
        '/?authorization=',
        accessService.getAccessToken(),
        '&width=',
        internalWidth,
        '&height=',
        internalHeight,
        '&round=',
        isRound,
        '&noCache=',
        noCache
      ];

      return pathArray.join('');
    }
  }
};

export const usersListItem = {
  components: {
    UsersListItemRenderer
  },
  mixins: [attributesChore],
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    layoutSchema() {
      const { layout } = this.$portalSettings.layouts[this.layoutKey];

      return extendAttrModules(
        layout,
        { attrs: { username: this.user.username } }
      );
    },

    $$userExtended() {
      const allAttrs = this.$$userAttributes
        .map((attr) => ({
          attributeId: attr._id,
          value: attr.defaultValue
        }));

      const constructedAttrs = collectionMerge(
        allAttrs,
        this.user.profile.attributes,
        { key: 'attributeId' }
      );
      return {
        ...this.user,
        ...{
          profile: {
            ...this.user.profile,
            attributes: portalAttributesToObject(constructedAttrs),
            createdAt: this.$options.filters.dateFormat(this.user.profile.created_at, 'D MMM YYYY', true)
          }
        },
        stringExpertise: this.user.expertise.map((d) => d.domainName).join(' · ')
      };
    }
  },
  methods: {
    goToUser() {
      this.$router.push({
        name: 'UserDetails',
        params: {
          account_name: this.$$userExtended.username
        }
      });
    }
  }
};
