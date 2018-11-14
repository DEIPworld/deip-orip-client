<template>
    <v-menu bottom left offset-y>
        <v-btn icon large class="ma-0" slot="activator" v-show="notifications.length">
            <v-badge color="amber darken-3" right overlap>
                <v-icon size="32px" color="grey lighten-1">chat_bubble</v-icon>
                <span slot="badge">{{ notifications.length }}</span>
            </v-badge>
        </v-btn>

        <!-- temporary solution for notifications. will be better -->
        <v-list class="hidden-last-child" v-show="notifications.length">
            <!-- TODO: move this to component -->
            <template v-for="notification in notifications">

                <div class="c-pv-2 c-ph-4" v-if="notification.type === 'new-proposal'">
                    <div>
                        <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: notification.meta.creator } }">
                            {{ { profile: notification.meta.creatorInfo, account: { name: notification.meta.creator} } | fullname }}
                        </router-link>
                        <span class="clickable" @click="clickNewProposalNotification(notification)">
                            <span v-if="notification.meta.action === START_RESEARCH">proposed to start new research in</span>
                            <span v-else-if="notification.meta.action === CREATE_RESEARCH_MATERIAL">proposed new research result in</span>
                            <span v-else-if="notification.meta.action === START_RESEARCH_TOKEN_SALE">proposed to start token sale in</span>
                            <span v-else-if="notification.meta.action === INVITE_MEMBER">proposed to invite new member in</span>
                            <span v-else>created a proposal in</span>
                            <span class="a">{{ notification.meta.groupInfo.name }}</span>
                        </span>
                    </div>
                    <div class="grey--text caption c-mt-1">
                        <v-icon size="16" color="grey">event</v-icon> {{ new Date(notification.created_at).toDateString() }}
                        <span style="cursor: pointer" class="a orange--text right" @click="readNotification($event, notification)">Mark as read</span>
                    </div>
                </div>

                <div class="c-pv-2 c-ph-4" v-else-if="notification.type === 'completed-proposal'">
                    <div class="clickable">
                        
                        <span v-if="notification.meta.action === START_RESEARCH">
                            <router-link class="a" :to="{ 
                                    name: 'ResearchGroupDetails', 
                                    params: { 
                                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink) } 
                                    }">
                                {{ notification.meta.groupInfo.name }}
                            </router-link>
                            <span @click="clickNewResearchStartedNotification(notification)">
                                group has started new
                                <router-link class="a" :to="{ 
                                    name: 'ResearchDetails', 
                                    params: { 
                                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink), 
                                        research_permlink: encodeURIComponent(notification.meta.data.permlink) } 
                                    }">
                                    {{ notification.meta.data.title }}
                                </router-link>
                                research
                            </span>
                        </span>

                        <span v-else-if="notification.meta.action === CREATE_RESEARCH_MATERIAL">
                            <span @click="clickNewResearchContentPublishedNotification(notification)"> 
                                New <span class="a">{{ contentTypesDictionary[notification.meta.data.type]['text'] }}</span> 
                                has been published in
                            </span>
                            <router-link class="a" :to="{ 
                                    name: 'ResearchDetails', 
                                    params: { 
                                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink), 
                                        research_permlink: encodeURIComponent(notification.meta.researchInfo.permlink) }
                                    }">
                                {{ notification.meta.researchInfo.title }}
                            </router-link>
                            research
                        </span>
                        
                        <span v-else-if="notification.meta.action === START_RESEARCH_TOKEN_SALE">
                            <span @click="clickTokenSaleScheduledNotification(notification)"> 
                                Token Sale has been scheduled for
                                <span class="a">{{ notification.meta.researchInfo.title }}</span>
                                research
                            </span>
                        </span>

                        <span v-else-if="notification.meta.action === INVITE_MEMBER">
                            <router-link class="a" :to="{ name: 'UserDetails', params: { account_name: notification.meta.data.name } }">
                                {{ { profile: notification.meta.inviteeInfo, account: { name: notification.meta.data.name } } | fullname }}
                            </router-link>
                            <span @click="clickNewMemberInvitedNotification(notification)">
                                has been invited to 
                                <span class="a">{{ notification.meta.groupInfo.name }}</span>
                                group
                            </span>
                        </span>
                        <span v-else></span>
                    </div>
                    <div class="grey--text caption c-mt-1">
                        <v-icon size="16" color="grey">event</v-icon> {{ new Date(notification.created_at).toDateString() }}
                        <span style="cursor: pointer" class="a orange--text right" @click="readNotification($event, notification)">Mark as read</span>
                    </div>
                </div>
                <v-divider></v-divider>
            </template>
        </v-list>
    </v-menu>
</template>

<script>

    import httpService from './../../../services/http/notifications';
    import { types } from './../../../services/ProposalService';
    import { contentTypesDictionary } from './../../../services/ResearchService';
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: 'NotificationsList',
        props: {
            notifications: { type: Array, required: true, default: () => [] },
        },
        data() {
            return {
                ...types,
                contentTypesDictionary
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        methods: {
            clickNewProposalNotification(notification) {
                this.$router.push({ 
                    name: 'ResearchGroupDetails', 
                    params: { research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink) }, 
                    hash: '#proposals'
                });
                this.readNotification(null, notification)
            },

            clickNewResearchStartedNotification(notification) {
                this.$router.push({
                    name: 'ResearchDetails', 
                    params: { 
                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink), 
                        research_permlink: encodeURIComponent(notification.meta.data.permlink) 
                    }
                });
                this.readNotification(null, notification)
            },

            clickNewResearchContentPublishedNotification(notification) {
                this.$router.push({
                    name: 'ResearchContentDetails', 
                    params:  {   
                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink), 
                        research_permlink: encodeURIComponent(notification.meta.researchInfo.permlink),
                        content_permlink: encodeURIComponent(notification.meta.data.permlink)
                    }
                });
                this.readNotification(null, notification);
            },

            clickTokenSaleScheduledNotification(notification) {
                this.$router.push({
                    name: 'ResearchDetails', 
                    params:  {   
                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink), 
                        research_permlink: encodeURIComponent(notification.meta.researchInfo.permlink),
                    }
                });
                this.readNotification(null, notification);
            },

            clickNewMemberInvitedNotification(notification) {
                this.$router.push({
                    name: 'ResearchGroupDetails', 
                    params: { 
                        research_group_permlink: encodeURIComponent(notification.meta.groupInfo.permlink) 
                    }, 
                });
                this.readNotification(null, notification);
            },

            readNotification($event, notification) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                httpService.markUserNotificationAsRead(this.user.username, notification._id)
                    .then(() => {
                        this.$store.dispatch('auth/loadNotifications');
                    })
            }
        },
        watch: {
            '$route' (to, from) {
                this.$store.dispatch('auth/loadNotifications');
            }
        },

        created() {
            this.$store.dispatch('auth/loadNotifications');
        }
    }
</script>