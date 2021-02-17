  import Vue from 'vue';
import moment from 'moment';
import where from 'filter-where';
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


Vue.filter('avatarSrc', (profile, width, height, isRound = false, noCache = false) => {
  const internalWidth = width * 2;
  const internalHeight = height ? height * 2 : internalWidth;
  const profileId = profile ? profile._id : 'initdelegate';

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
});


Vue.filter('researchGroupLogoSrc', (researchGroupExternalId, width = 360, height = 80, isRound = false, noCache = true) => {

  const internalWidth = width * 2;
  const internalHeight = height ? height * 2 : internalWidth;
  const id = researchGroupExternalId || null;

  const pathArray = [
    window.env.DEIP_SERVER_URL,
    '/api/groups/logo/',
    id,
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
});


Vue.filter('accountFullname', (model, width, height, isRound = false, noCache = true) => {
  const { account, profile } = model;
  const { is_research_group: isResearchGroup } = account;
  const { name: researchGroupTitle } = model;
  const isUser = !isResearchGroup;

  const path = isUser
    ? Vue.filter('fullname')({ profile, account })
    : researchGroupTitle

  return path;
});

Vue.filter('accountAvatarSrc', (model, width, height, isRound = false, noCache = true) => {
  const internalWidth = width * 2;
  const internalHeight = height ? height * 2 : internalWidth;

  const { account, profile } = model;
  const { name: id, is_research_group: isResearchGroup } = account;
  const isUser = !isResearchGroup;

  const path = isUser
    ? Vue.filter('avatarSrc')({ _id: id }, internalWidth, internalHeight, isRound, noCache)
    : Vue.filter('researchGroupLogoSrc')(id, internalWidth, internalHeight, isRound, noCache)

  return path;
});

Vue.filter('researchBackgroundSrc', (researchExternalId, width = 1440, height = 430, isRound = false, noCache = true) => `${window.env.DEIP_SERVER_URL}/api/research/${researchExternalId}/attribute/${researchExternalId}/file/background.png?authorization=${accessService.getAccessToken()}&image=true&width=${width}&height=${height}&round=${isRound}&noCache=${noCache}`);

Vue.filter('tenantLogoSrc', (tenant, width = 120, height = 40, isRound = false, noCache = true) => `${window.env.DEIP_SERVER_URL}/tenant/logo/${tenant.account ? tenant.account.name : tenant._id}?width=${width}&height=${height}&noCache=${noCache}`);

Vue.filter('tenantBackgroundSrc', (tenant, width = 1440, height = 430, isRound = false, noCache = true) => `${window.env.DEIP_SERVER_URL}/tenant/banner/${tenant.account ? tenant.account.name : tenant._id}?width=${width}&height=${height}&noCache=${noCache}`);

Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => (!fromUtcToLocal
  ? moment(value).format(format)
  : moment.utc(value).local().format(format)));

Vue.filter('shortHash', (value) => (value ? value.substring(0, 8) : ''));

Vue.filter('joinByKey', (value, key, separator = ', ') => {
  if (!value) return '';
  return value.map((el) => el[key]).join(separator);
});

Vue.filter('commaNumber', (value, separator = ',') => {
  if (!value && value !== 0) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
});

// Vue.filter('where', (value, f = {}) => {
//   if (!value) return '';
//   return value.filter(where(f));
// });

Vue.filter('numDir', (value) => {
  if (!value) return '';
  return parseFloat(value) >= 0 ? `+${value}` : value;
});

Vue.filter('checkVal', (value) => value || '—');

Vue.filter('numDirClass', (value, type = 'foreground') => {
  if (!value || parseFloat(value) === 0) return '';

  if (type === 'background') {
    return parseFloat(value) > 0
      ? 'success lighten-3'
      : 'error lighten-3';
  }

  return parseFloat(value) > 0
    ? 'success--text'
    : 'error--text';
});

Vue.filter('timeLeft', (value) => {
  const now = moment.utc().local();
  const start = moment.utc(value).local();

  const months = Math.floor(moment.duration(start.diff(now)).asMonths());
  if (months > 1) return `${months} months`;

  const days = Math.floor(moment.duration(start.diff(now)).asDays());
  if (days > 1) return `${days} days`;

  const hours = Math.floor(moment.duration(start.diff(now)).asHours());
  if (hours > 1) return `${hours} hours`;

  const minutes = Math.floor(moment.duration(start.diff(now)).asMinutes());
  if (minutes > 1) return `${minutes} mins`;

  const seconds = Math.floor(moment.duration(start.diff(now)).asSeconds());
  return `${seconds} secs`;
});
