import { hasValue } from '@/utils/helpers';
import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

export const userDetails = {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isOwner() {
      return this.$currentUser.username === this.user.username;
    }
  },
  methods: {
    fullName(firstName, secondName) {
      if (!(firstName || secondName)) return this.user.username;
      return `${this.user.profile.attributes[firstName].value || ''} ${this.user.profile.attributes[secondName].value || ''}`;
    },
    locationInfo(city, country) {
      return `${this.user.profile.attributes[city].value || ''} ${this.user.profile.attributes[country].value || ''}`;
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
    },
    getAttribute(id) {
      const attr = this.user.profile.attributes[id];
      if (!attr || !hasValue(attr.value)) return false;
      return attr;
    },

    ifAttribute(id) {
      const attr = this.getAttribute(id);

      return attr ? hasValue(attr.value) : false;
    },

    attributeValue(id) {
      const attr = this.user.profile.attributes[id];

      return attr ? attr.value : false;
    }
  }
};
