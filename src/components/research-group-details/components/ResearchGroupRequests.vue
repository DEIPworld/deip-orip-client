<template>
  <v-sheet width="410">
    <v-card height="120" outlined>
      <v-tabs
        v-model="invitesTabs"
        grow
        color="dark"
        light
        :hide-slider="!invites.length || !pendingJoinRequests.length"
      >
        <v-tab v-if="pendingJoinRequests.length" light>
          <div class="mr-auto d-flex">
            <span class="text-h6">Join requests</span>
            <v-badge
              color="warning"
              inline
              :content="pendingJoinRequests.length"
            />
          </div>
        </v-tab>
        <v-tab v-if="invites.length" class="align-right" dark>
          <div class="mr-auto d-flex">
            <span class="text-h6">Pending invites</span>
            <v-badge
              color="warning"
              inline
              :content="invites.length"
            />
          </div>
        </v-tab>
      </v-tabs>
      <v-divider />

      <v-tabs-items v-model="invitesTabs">
        <v-tab-item v-if="pendingJoinRequests.length">
          <div class="pt-4 px-6 d-flex align-center">
            <v-icon @click="prevSlide('joinRequestsSlider', pendingJoinRequests)">
              navigate_before
            </v-icon>
            <v-carousel hide-delimiters :show-arrows="false" light height="auto" v-model="joinRequestsSlider">
              <v-carousel-item
                v-for="(join, index) in pendingJoinRequests"
                :key="'join-request-' + index"
              >
                <d-box-item
                  :avatar="join.user.profile | avatarSrc(32, 32, false)"
                  :size="32"
                >
                  <v-clamp
                    autoresize
                    :max-lines="1"
                    class="text-body-2"
                  >
                    {{ join.user | fullname }}
                  </v-clamp>
                  <div class="text-caption">
                    Wants to join your group
                  </div>
                </d-box-item>
              </v-carousel-item>
            </v-carousel>
            <v-icon @click="nextSlide('joinRequestsSlider', pendingJoinRequests)">
              navigate_next
            </v-icon>
            <v-btn text small class="ml-1 align-self-start" color="primary" @click="openJoinRequestDetails(pendingJoinRequests[joinRequestsSlider])">
              View
            </v-btn>
          </div>
        </v-tab-item>
        <v-tab-item v-if="invites.length">
          <div class="pt-4 px-6 d-flex align-center">
            <v-btn small icon @click="prevSlide('invitesSlider', invites)">
              <v-icon>
                navigate_before
              </v-icon>
            </v-btn>
            
            <v-carousel hide-delimiters :show-arrows="false" light height="auto" v-model="invitesSlider" class="mx-2">
              <v-carousel-item
                v-for="(invite, index) in invites"
                :key="'invite-request-' + index"
              >
                <d-box-item
                  :avatar="invite.user.profile | avatarSrc(32, 32, false)"
                  :size="32"
                >
                  <v-clamp
                    autoresize
                    :max-lines="1"
                    class="text-body-2"
                  >
                    {{ invite.user | fullname }}
                  </v-clamp>
                  <v-clamp
                    autoresize
                    :max-lines="2"
                    class="text-caption"
                  >
                    {{ invite.user | employmentOrEducation }}
                  </v-clamp>
                </d-box-item>
              </v-carousel-item>
            </v-carousel>

            <v-btn small icon @click="nextSlide('invitesSlider', invites)">
              <v-icon>
                navigate_next
              </v-icon>
            </v-btn>
            <v-btn text small class="ml-1 align-self-start" color="primary" :to="{ name: 'UserDetails', params: { account_name: invites[invitesSlider].user.account.name } }">
              View
            </v-btn>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <handle-join-request-dialog
      v-if="selectedJoinRequest"
      :is-open="options.isHandleRequestDialogOpen"
      :join-request="selectedJoinRequest"
      :group-id="group.id"
      @onClose="closeHandleJoinRequestDialog"
    />
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import HandleJoinRequestDialog from '@/components/research-group-details/components/HandleJoinRequestDialog';

  export default {
    name: '',
    components: {
      DBoxItem,
      HandleJoinRequestDialog
    },

    data() {
      return {
        invitesTabs: null,
        selectedJoinRequest: undefined,
        invitesSlider: 0,
        joinRequestsSlider: 0
      };
    },
    computed: {
      ...mapGetters({
        invites: 'researchGroup/invites',
        pendingJoinRequests: 'researchGroup/pendingJoinRequests',
        options: 'researchGroup/options',
        group: 'researchGroup/group'
      })
    },
    methods: {
      nextSlide(sliderCounterName, items) {
        this[sliderCounterName] === items.length - 1 ? this[sliderCounterName] = 0 : this[sliderCounterName]++;
      },
      prevSlide(sliderCounterName, items) {
        this[sliderCounterName] === 0 ? this[sliderCounterName] = items.length - 1 : this[sliderCounterName]--;
      },
      openJoinRequestDetails(item) {
        this.$store.dispatch('researchGroup/changeOptions', {
          key: 'isHandleRequestDialogOpen',
          value: true
        });
        this.selectedJoinRequest = item;
      },
      closeHandleJoinRequestDialog() {
        this.$store.dispatch('researchGroup/changeOptions', {
          key: 'isHandleRequestDialogOpen',
          value: false
        });
        this.selectedJoinRequest = undefined;
      }
    }
  };
</script>
