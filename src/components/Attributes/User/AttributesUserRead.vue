<template>
  <div>
    <users-list
      :users="attribute.value"
    >
      <template #item-avatar="{ user, avatar }">
        <v-badge
          avatar
          overlap
          bordered
          color="warning"
          :value="!attrs$.project.members.includes(user.account.name)"
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
  import UsersList from '@/components/Users/List/UsersList';
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  export default {
    name: 'AttributesUserRead',
    components: { UsersList },
    mixins: [BindsAttrs, attributeRead]
  };
</script>
