<template>
  <d-block title="Select research group">
    <v-radio-group v-model="isPersonal">
      <d-stack horizontal>
        <v-radio :value="true" label="Personal group" class="ma-0" />
        <v-radio :value="false" label="All groups" class="ma-0" />
      </d-stack>
    </v-radio-group>

    <v-autocomplete
      v-model="internalValue"
      label="Select research group"
      :items="groups"
      item-text="name"
      item-value="external_id"
      :disabled="isPersonal"
      outlined
    >
      <template #append-item>
        <div>
          <v-divider />
          <div class="px-2 pt-2">
            <v-btn
              class="px-2"
              color="primary"
              text
              small
              :to="{
                name: 'group.create',
                query: {
                  backTo: 'research.create'
                }
              }"
            >
              Add new group
            </v-btn>
          </div>
        </div>
      </template>
    </v-autocomplete>
  </d-block>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { nulledModel } from '@/mixins/extendModel';

  export default {
    name: 'AttributesResearchGroupSet',
    components: { DStack, DBlock },
    mixins: [attributeSet, nulledModel],
    data() {
      return {
        isPersonal: true
      };
    },
    computed: {
      ...mapGetters({
        userGroups: 'auth/userGroups',
        userCoworkers: 'auth/userCoworkers'
      }),

      personalGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      groups() {
        return this.$where(this.userGroups, { is_personal: false });
      }
    },
  };
</script>
