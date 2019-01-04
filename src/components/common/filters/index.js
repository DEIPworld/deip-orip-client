import Vue from 'vue'
import moment from 'moment';

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

Vue.filter('avatarSrc', function (avatar, width, height, noCache ) {
    return `${window.env.DEIP_SERVER_URL}/public/files/avatars/${avatar}?width=${width}&height=${height}&noCache=${noCache}`
});

Vue.filter('agencyLogoSrc', function (agency, width, height, noCache ) {
    return `${window.env.DEIP_SERVER_URL}/public/agencies/logo/${agency}?width=${width}&height=${height}&noCache=${noCache}`
});

Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => {
    return !fromUtcToLocal 
        ? moment(value).format(format)
        : moment.utc(value).local().format(format);
});
