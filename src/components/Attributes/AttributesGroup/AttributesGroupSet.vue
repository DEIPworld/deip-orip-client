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
            <v-btn text small color="primary" class="px-2">
              Add new group
            </v-btn>
          </div>
        </div>
      </template>
    </v-autocomplete>
  </d-block>
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesGroupSet',
    components: { DStack, DBlock },
    mixins: [commonSet],
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

    watch: {
      isPersonal(value) {
        if (value) {
          this.internalValue = this.personalGroup.external_id;
        } else {
          this.internalValue = null;
        }
      }
    },

    created() {
      this.internalValue = this.personalGroup.external_id;
    }
  };
</script>
