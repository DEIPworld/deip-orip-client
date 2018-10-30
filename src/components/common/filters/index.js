import Vue from 'vue'
import moment from 'moment';

Vue.filter('fullname', function (enrichedProfile) {
    return enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.firstName 
        ? `${enrichedProfile.profile.firstName} ${enrichedProfile.profile.lastName || ''}` 
        : enrichedProfile.account.name;
});

Vue.filter('userLocation', function (enrichedProfile) {
    debugger;
    return enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.location 
        ? `${enrichedProfile.profile.location.city || ''} ${enrichedProfile.profile.location.country || ''}` 
        : '';
});

Vue.filter('employmentOrEducation', function (enrichedProfile) {
    const activeEmployment = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.employment && enrichedProfile.profile.employment.some(e => e.isActive) 
        ? enrichedProfile.profile.employment.find(e => e.isActive)
        : null;

    const activeEducation = enrichedProfile && enrichedProfile.profile && enrichedProfile.profile.education && enrichedProfile.profile.education.some(e => e.isActive) 
        ? enrichedProfile.profile.education.find(e => e.isActive)
        : null;

    return activeEmployment ? activeEmployment.company : activeEducation ? activeEducation.educationalInstitution : "";
});

Vue.filter('avatarSrc', function (avatar, width, height, noCache ) {
    return `${process.env.DEIP_SERVER_URL}/public/files/avatars/${avatar}?width=${width}&height=${height}&noCache=${noCache}`
});

Vue.filter('dateFormat', (value, format, fromUtcToLocal = false) => {
    return !fromUtcToLocal 
        ? moment(value).format(format)
        : moment.utc(value).local().format(format);
});
