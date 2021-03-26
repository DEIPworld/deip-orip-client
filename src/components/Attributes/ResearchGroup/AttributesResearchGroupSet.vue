<template>
  <d-block :title="$$label">
    <v-radio-group v-model="isPersonal" :disabled="!$$isEditable">
      <d-stack horizontal>
        <v-radio :value="true" label="My project" class="ma-0" />
        <v-radio :value="false" label="Team project" class="ma-0" />
      </d-stack>
    </v-radio-group>

    <d-autocomplete
      v-model="researchGroup"
      label="Team"
      :items="groups"
      item-text="name"
      item-value="external_id"
      :disabled="isPersonal || !$$isEditable"
      outlined
      v-bind="isMultipleProps"
      name="Project team"
      autocomplete="off"
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
                name: 'CreateResearchGroup',
                params: {
                  account_name: $currentUser ? $currentUser.username : ''
                }
              }"
            >
              Add new team
            </v-btn>
          </div>
        </div>
      </template>
    </d-autocomplete>
  </d-block>
</template>

<script>
  import { attributeSet } from '@/components/Attributes/_mixins';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';
  import DStack from '@/components/Deipify/DStack/DStack';
  import { nulledModel } from '@/mixins/extendModel';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AttributesResearchGroupSet',
    components: { DAutocomplete, DStack, DBlock },
    mixins: [attributeSet, nulledModel],
    data() {
      return {
        researchGroup: undefined,
        isPersonal: true
      };
    },
    computed: {
      ...mapGetters({
        userGroups: 'auth/userGroups',
      }),

      isMultipleProps() {
        return this.attribute.isMultiple ? {
          multiple: true,
          chips: true,
          deletableChips: true
        } : {};
      },

      personalGroup() {
        return this.$where(this.userGroups, { is_personal: true })[0];
      },

      groups() {
        return this.$where(this.userGroups, { is_personal: false });
      }
    },
    watch: {

      isPersonal: {
        handler(val) {
          if (val) {
            this.internalValue = [this.personalGroup.external_id];
            this.researchGroup = this.personalGroup.external_id;
          } else {
            this.internalValue = this.groups.length ? [this.groups[0].external_id] : undefined;
            this.researchGroup = this.groups.length ? this.groups[0].external_id : undefined;
          }
        }
      },

      researchGroup: {
        handler(val) {
          if (val) {
            this.internalValue = [val]
          } else {
            if (val === null) {
              this.internalValue = null;
            } else {
              this.internalValue = undefined;
            }
          }
        }
      }
    },

    mounted() {
      if (this.$$isEditable) {

        if (this.$$isHidden) {
          this.internalValue = this.internalValue 
            ? Array.isArray(this.internalValue) 
              ? this.internalValue 
              : [this.internalValue]
            : null;
          this.researchGroup = this.internalValue 
            ? Array.isArray(this.internalValue) 
              ? this.internalValue[0]
              : this.internalValue
            : null;

        } else if (this.isPersonal) {
          this.internalValue = [this.personalGroup.external_id];
          this.researchGroup = this.personalGroup.external_id;
        }

      }
    }
  };
</script>
