import Vue from 'vue'
import config from './../../../config'
import moment from 'moment';

Vue.filter('fullname', function (enrichedProfile) {
    return enrichedProfile.profile && enrichedProfile.profile.firstName 
        ? `${enrichedProfile.profile.firstName} ${enrichedProfile.profile.lastName || ''}` 
        : enrichedProfile.account.name;
});

Vue.filter('avatarSrc', function (avatar, width, height, noCache ) {
    return `${config['deip-server-url']}/public/files/avatars/${avatar}?width=${width}&height=${height}&noCache=${noCache}`
});

Vue.filter('dateFormat', (value, format) => {
    return moment(value).format(format);
});
