<template>
  <div v-if="researchComponents.length" class="mt-6 mb-6">
    <d-block
      v-for="(item, index) in researchComponents"
      :key="'research-component-' + index"
      :title="item.component.readinessLevelShortTitle"
      sm
    >
      <v-chip-group
        v-model="localModel"
        column
        multiple
        active-class="primary--text"
        class="mt-n4"
      >
        <d-list-expand :active="item.component.readinessLevels.length > 4">
          <template #default="{expanded}">
            <template v-for="(step, i) in item.component.readinessLevels">
              <v-chip
                v-if="expanded || i < 4"
                :key="`readinessLevels-filter-${i}`"
                :value="`${item._id}:${i}`"
                class="d-block mt-2 mx-0 mb-0"
                :class="localModel.includes(`${item._id}:${i}`) ? 'transparent' : 'grey lighten-4'"
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
  import { ResearchListAbstractFilter } from '@/components/ResearchList/ResearchListFilter/ResearchListAbstractFilter';
  import { mapGetters } from 'vuex';

  export default {
    name: 'ResearchListFilterComponents',

    mixins: [ResearchListAbstractFilter],

    data() {
      return {
        researchComponents: []
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    created() {
      this.researchComponents = this.$options.filters.where(
        this.tenant.profile.settings.researchComponents,
        {
          isVisible: true,
          type: 'stepper'
        }
      );
    }
  };
</script>
