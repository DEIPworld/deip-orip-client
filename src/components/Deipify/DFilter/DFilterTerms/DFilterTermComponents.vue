<template>
  <div v-if="researchAttributes.length">
    <d-block
      v-for="(item, index) in researchAttributes"
      :key="'research-attribute-' + index"
      :title="item.shortTitle"
      widget="compact"
    >
      <v-chip-group
        v-model="internalValue"
        column
        multiple
        active-class="primary--text"
        class="mt-n4"
      >
        <d-list-expand :active="item.valueOptions.length > 4">
          <template #default="{expanded}">
            <template v-for="(step, i) in item.valueOptions">
              <v-chip
                v-if="expanded || i < 4"
                :key="`research-attribute-filter-${i}`"
                :value="`${item._id}:${step.value}`"
                class="d-block mt-2 mx-0 mb-0"
                :class="internalValue.includes(`${item._id}:${step.value}`) ? 'transparent' : 'grey lighten-4'"
                style="width:100%"
              >
                <v-avatar left color="primary" class="white--text">
                  {{ i + 1 }}
                </v-avatar>
                <div class="text-truncate">
                  {{ step.title }}
                </div>
              </v-chip>
            </template>
          </template>
        </d-list-expand>
      </v-chip-group>
    </d-block>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'DFilterTermComponents',

    components: {
      DBlock,
      DListExpand
    },

    mixins: [Proxyable],

    data() {
      return {
        researchAttributes: []
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    created() {
      this.researchAttributes = this.$options.filters.where(
        this.tenant.profile.settings.researchAttributes,
        {
          isVisible: true,
          type: 'stepper'
        }
      );
    }
  };
</script>
