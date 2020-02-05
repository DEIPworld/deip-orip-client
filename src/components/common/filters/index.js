import Vue from 'vue'
import moment from 'moment';
import { getAccessToken } from '@/utils/auth'

Vue.filter('fullname', function (enrichedProfile) {
    return enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.firstName
        ? `${enrichedProfile.profile.firstName} ${enrichedProfile.profile.lastName || ''}`
        : enrichedProfile.account.name;
});

Vue.filter('userLocation', function (enrichedProfile) {
    const hasCity = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.location.city;
    const hasCountry = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.location.country;
    const city = hasCity
        ? enrichedProfile.profile.location.city
        : null;
    const country = hasCountry
        ? enrichedProfile.profile.location.country
        : null;

    if (!city && !country) {
        return '';
    }

    return `${city ? city : ''}${ city && country ? ', ' : '' }${country ? country : ''}`;
});

Vue.filter('employmentOrEducation', function (enrichedProfile) {
    const hasEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.length;
    const hasActiveEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.some(e => e.isActive);
    const employment = hasActiveEmployment
        ? enrichedProfile.profile.employment.find(e => e.isActive)
        : hasEmployment
            ? enrichedProfile.profile.employment[enrichedProfile.profile.employment.length - 1]
            : null;

    const hasEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.length;
    const hasActiveEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.some(e => e.isActive);
    const education = hasActiveEducation
        ? enrichedProfile.profile.education.find(e => e.isActive)
        : hasEducation
            ? enrichedProfile.profile.education[enrichedProfile.profile.education.length - 1]
            : null;

    if (!education && !employment) {
        return '';
    }

    return `${education ? education.educationalInstitution : ''}${ education && employment ? ', ' : '' }${employment ? employment.company : ''}`;
});

Vue.filter('avatarSrc', function (avatar, width, height, isRound = false, noCache = false) {
    return `${window.env.DEIP_SERVER_URL}/api/user/avatar/${avatar}?authorization=${getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}`
});

Vue.filter('researchBackgroundSrc', function (researchId, width = 1440, height = 430, isRound = false, noCache = true, ext = 'png') {
    return `${window.env.DEIP_SERVER_URL}/api/research/background/${researchId}?authorization=${getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}&ext=${ext}`
});

Vue.filter('researchGroupLogoSrc', function (researchGroupId, width = 360, height = 80, isRound = false, noCache = true, ext = 'png') {
    return `${window.env.DEIP_SERVER_URL}/api/groups/logo/${researchGroupId}?authorization=${getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}&ext=${ext}`
});

Vue.filter('tenantLogoSrc', function (tenant, width, height, noCache, ext = 'png') {
    // return `${window.env.DEIP_SERVER_URL}/public/tenants/logo/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
    return tenant ? `/assets/img/tenants/${tenant._id}/logo.svg` : `/assets/img/logo_customize.svg`;
});

Vue.filter('tenantSymbolSrc', function (tenant, width, height, noCache, ext = 'png') {
    // return `${window.env.DEIP_SERVER_URL}/public/tenants/symbol/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
    return tenant ? `/assets/img/tenants/${tenant._id}/symbol.svg` : `/assets/img/logo.svg`;
});

Vue.filter('tenantBackgroundSrc', function (tenant, width, height, noCache, ext = 'png') {
    // return `${window.env.DEIP_SERVER_URL}/public/tenants/background-image/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
    return tenant ? `/assets/img/tenants/${tenant._id}/background.png` : `/assets/img/feed-background.svg`;
});

Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => {
    return !fromUtcToLocal
        ? moment(value).format(format)
        : moment.utc(value).local().format(format);
});

Vue.filter('researchAbstract', (value) => {
    try {
        let json = JSON.parse(value);
        return json.description;
    } catch (e) {
        if (typeof value === 'string') {
            return value;
        } else {
            return false;
        }
    }
});

Vue.filter('researchVideoSrc', (value) => {
    try {
        let json = JSON.parse(value);
        return json.video_src;
    } catch (e) {
        return "";
    }
});

Vue.filter('researchMilestones', (value) => {
    try {
        let json = JSON.parse(value);
        return Array.isArray(json.milestones) ? json.milestones : [];
    } catch (e) {
        return [];
    }
});

Vue.filter('researchTokenized', (value) => {
    try {
        let json = JSON.parse(value);
        return !!json.is_tokenized;
    } catch (e) {
        return true;
    }
});

Vue.filter('reviewContent', (value) => {
  try {
    let json = JSON.parse(value);
    if (json.reviewHtmlContent) {
      return json.reviewHtmlContent;
    }
    return value;
  } catch (e) {
    return value;
  }
});

Vue.filter('reviewRatings', (value) => {
  try {
    let json = JSON.parse(value);
    return json.ratings;
  } catch (e) {
    return {
      novelty: 0,
      technicalQuality: 0,
      methodology: 0,
    };
  }
});
