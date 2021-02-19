<template>
  <div>
    <users-list
      :users="attribute.value"
      view-type="brief"
    >
      <template #item-avatar="{ user, avatar }">
        <v-badge
          avatar
          overlap
          bordered
          color="warning"
          :value="pendingUser(user.account.name) && isUserRelatedToProject"
        >
          <template #badge>
            <v-avatar>
              <v-icon :size="16">
                mdi-clock-time-three-outline
              </v-icon>
            </v-avatar>
          </template>

          <v-avatar :size="40">
            <v-img :src="avatar" />
          </v-avatar>
        </v-badge>
      </template>

      <template
        v-if="!attributeInfo.isMultiple"
        #item-info="{ user }"
      >
        <div class="text-caption font-weight-medium">
          {{ attributeInfo.title }}
        </div>

        <div class="text-caption">
          <a class="text--secondary link" :href="`mailto:${user.profile.email}`" @click.prevent>
            {{ user.profile.email }}
          </a>
        </div>
      </template>
    </users-list>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import UsersList from '@/features/Users/components/List/UsersList';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  export default {
    name: 'AttributesUserRead',
    components: { UsersList },
    mixins: [BindsAttrs, attributeRead],
    props: {
      project: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      isUserRelatedToProject() {
        return !this.$isGuest && [
          ...this.project.members,
          ...this.project.researchRef.expressLicenses.map((lic) => lic.owner)
        ].includes(this.$currentUser.username);
      }
    },
    methods: {
      pendingUser(userName) {
        return !this.project.members.includes(userName);
      }
    }
  };
</script>
