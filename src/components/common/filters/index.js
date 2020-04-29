import Vue from 'vue';
import moment from 'moment';
import { AccessService } from '@deip/access-service';

const accessService = AccessService.getInstance();

Vue.filter('fullname', (enrichedProfile) => (enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.firstName
  ? `${enrichedProfile.profile.firstName} ${enrichedProfile.profile.lastName || ''}`
  : enrichedProfile.account.name));

Vue.filter('userLocation', (enrichedProfile) => {
  const hasCity = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.location && enrichedProfile.profile.location.city;
  const hasCountry = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.location && enrichedProfile.profile.location.country;
  const city = hasCity
    ? enrichedProfile.profile.location.city
    : null;
  const country = hasCountry
    ? enrichedProfile.profile.location.country
    : null;

  if (!city && !country) {
    return '';
  }

  return `${city || ''}${city && country ? ', ' : ''}${country || ''}`;
});

Vue.filter('employmentOrEducation', (enrichedProfile) => {
  const hasEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.length;
  const hasActiveEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.some((e) => e.isActive);
  const employment = hasActiveEmployment
    ? enrichedProfile.profile.employment.find((e) => e.isActive)
    : hasEmployment
      ? enrichedProfile.profile.employment[enrichedProfile.profile.employment.length - 1]
      : null;

  const hasEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.length;
  const hasActiveEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.some((e) => e.isActive);
  const education = hasActiveEducation
    ? enrichedProfile.profile.education.find((e) => e.isActive)
    : hasEducation
      ? enrichedProfile.profile.education[enrichedProfile.profile.education.length - 1]
      : null;

  if (!education && !employment) {
    return '';
  }

  return `${education ? education.educationalInstitution : ''}${education && employment ? ', ' : ''}${employment ? employment.company : ''}`;
});

Vue.filter('avatarSrc', (profile, width, height, isRound = false, noCache = false) => (profile
  ? `${window.env.DEIP_SERVER_URL}/api/user/avatar/${profile._id}/?authorization=${accessService.getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}`
  : `${window.env.DEIP_SERVER_URL}/api/user/avatar/initdelegate/?authorization=${accessService.getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}`));

Vue.filter('researchBackgroundSrc', (researchExternalId, width = 1440, height = 430, isRound = false, noCache = true, ext = 'png') => `${window.env.DEIP_SERVER_URL}/api/research/background/${researchExternalId}?authorization=${accessService.getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}&ext=${ext}`);

Vue.filter('researchGroupLogoSrc', (researchGroupId, width = 360, height = 80, isRound = false, noCache = true, ext = 'png') => `${window.env.DEIP_SERVER_URL}/api/groups/logo/${researchGroupId}?authorization=${accessService.getAccessToken()}&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}&ext=${ext}`);

Vue.filter('tenantLogoSrc', (tenant, width, height, noCache, ext = 'png') =>
// return `${window.env.DEIP_SERVER_URL}/public/tenants/logo/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
  (tenant ? `/assets/img/tenants/${tenant.permlink}/logo.png` : '/assets/img/toolbar-logo.svg'));

Vue.filter('tenantSymbolSrc', (tenant, width, height, noCache, ext = 'png') =>
// return `${window.env.DEIP_SERVER_URL}/public/tenants/symbol/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
  (tenant ? `/assets/img/tenants/${tenant.permlink}/symbol.png` : '/assets/img/logo.svg'));

Vue.filter('tenantBackgroundSrc', (tenant, width, height, noCache, ext = 'png') =>
// return `${window.env.DEIP_SERVER_URL}/public/tenants/background-image/${tenant._id}?width=${width}&height=${height}&noCache=${noCache}&ext=${ext}`
  (tenant ? `/assets/img/tenants/${tenant.permlink}/background.png` : '/assets/img/feed-background.svg'));

Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => (!fromUtcToLocal
  ? moment(value).format(format)
  : moment.utc(value).local().format(format)));

Vue.filter('shortHash', (value) => {
  return value ? value.substring(0, 8) : "";
})