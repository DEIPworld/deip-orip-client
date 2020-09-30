<template>
  <d-layout-full-screen v-if="tenantAttributes.length"
    title="Attributes placement settings"
    full-width
    :style="{height: `calc(100vh - ${$vuetify.application.top}px)`}"
    class="d-flex flex-column"
    no-gutters
  >
<!--    <pre>-->
<!--      {{researchAttributesAreas}}-->
<!--    </pre>-->
    <div class="flex-grow-1 flex-shrink-1 overflow-hidden d-flex">
      <v-sheet
        :width="320"
        :max-width="320"
        class="d-flex flex-column flex-grow-0 flex-shrink-0"
      >
        <div class="text-h6 flex-grow-0 flex-shrink-0 px-6 pt-6 pb-4">
          Available attributes
        </div>
        <div class="flex-grow-1 flex-shrink-1 overflow-y-auto d-flex flex-column px-6 pb-6">
          <draggable
            v-model="tenantAttributes"
            v-bind="sourceBlockOptions"
            class="flex-grow-1 flex-shrink-1"
          >
            <admin-attributes-settings-item
              v-for="attr in tenantAttributes"
              :key="attr._id"
              :attribute="attr"
            />
          </draggable>
        </div>
      </v-sheet>

      <v-divider vertical />

      <div class="flex-grow-1 flex-shrink-1 d-flex px-3 overflow-x-auto">
        <v-sheet
          v-for="(area, index) of Object.keys(researchAttributesAreas)"
          :key="`area-${index}`"
          :width="320"
          :max-width="320"
          class="d-flex flex-column flex-grow-0 flex-shrink-0"
        >
          <div class="text-h6 flex-grow-0 flex-shrink-0 px-3 pt-6 pb-4">
            {{ researchAttributesAreasTitles[area] }}
          </div>
          <div class="flex-grow-1 flex-shrink-1 overflow-y-auto d-flex flex-column px-3 pb-6">
            <draggable
              v-model="researchAttributesAreas[area]"
              v-bind="targetBlockOptions"
              class="flex-grow-1 flex-shrink-1"
            >
              <template v-if="!researchAttributesAreas[area].length" #header>
                <v-sheet
                  outlined
                  rounded
                  class="mb-2"
                >
                  <v-list-item>
                    <v-list-item-action class="ma-auto">
                      <v-icon small>
                        more_horiz
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-sheet>
              </template>

              <admin-attributes-settings-item
                v-for="attr in researchAttributesAreas[area]"
                :key="attr._id"
                :attribute="attr"
              >
                <template #actions>
                  <v-btn x-small icon @click="remove(area, attr)">
                    <v-icon>clear</v-icon>
                  </v-btn>
                </template>
              </admin-attributes-settings-item>
            </draggable>
          </div>
        </v-sheet>
      </div>
    </div>

    <v-divider />
    <v-sheet class="px-12 py-4 text-right">
      <v-btn
        color="primary"
        :disabled="!modelChanged || processing"
        :loading="processing"
        @click="safeSettings()"
      >
        Save
      </v-btn>
    </v-sheet>
  </d-layout-full-screen>
</template>

<script>
  import DLayoutFullScreen from '@/components/Deipify/DLayout/DLayoutFullScreen';
  import draggable from 'vuedraggable';
  import { tenantAttributes } from '@/mixins/platformAttributes';
  import { TenantService } from '@deip/tenant-service';
  import AdminAttributesSettingsItem
    from '@/components/AdminPanel/AdminAttributes/_partials/AdminAttributesSettingsItem';

  const tenantService = TenantService.getInstance();

  const researchAttributesAreas = () => ({
    researchForm: [],
    researchDetailsHeader: [],
    researchDetailsBody: [],
    researchDetailsRightSidebar: [],
    researchCard: []
  });

  export default {
    name: 'AdminAttributesSettings',
    components: {
      AdminAttributesSettingsItem,
      DLayoutFullScreen,
      draggable
    },
    mixins: [tenantAttributes],
    data() {
      return {
        researchAttributesAreas: researchAttributesAreas(),
        researchAttributesAreasCache: null,

        researchAttributesAreasTitles: {
          researchForm: 'Research create/edit form',
          researchDetailsHeader: 'Research details header',
          researchDetailsBody: 'Research details body',
          researchDetailsRightSidebar: 'Research details sidebar',
          researchCard: 'Research card'
        },

        sourceBlockOptions: {
          group: {
            name: 'attributes',
            pull: 'clone',
            put: false
          },
          sort: false,
          move: this.moveCheck
        },

        targetBlockOptions: {
          animation: 200,
          group: {
            name: 'attributes',
            pull: false
          },
          ghostClass: 'ghost'
        },

        processing: false
      };
    },
    computed: {
      modelChanged() {
        return this.researchAttributesAreasCache !== JSON.stringify(this.researchAttributesAreas);
      }
    },
    created() {
      const areas = Object.keys(this.$tenantSettings.researchAttributesAreas)
        .reduce((obj, area) => ({
          ...obj,
          ...{
            [area]: this.$tenantSettings.researchAttributesAreas[area]
              .map((attr) => this.getAttributeInfo(attr))
              .filter((attr) => attr)
          }
        }), {});

      this.researchAttributesAreas = {
        ...this.researchAttributesAreas,
        ...areas
      };

      this.researchAttributesAreasCache = JSON.stringify(this.researchAttributesAreas);
    },
    methods: {
      moveCheck(evt) {
        return !evt.relatedContext.list.find(
          (i) => i._id === evt.draggedContext.element._id
        );
      },
      remove(area, item) {
        this.researchAttributesAreas[area]
          .splice(this.researchAttributesAreas[area].indexOf(item), 1);
        this.researchAttributesAreas[area] = [...this.researchAttributesAreas[area]];
      },
      safeSettings() {
        this.processing = true;

        const clonedProfile = _.cloneDeep(this.$tenant.profile);

        const updatedAreas = Object.keys(this.researchAttributesAreas)
          .reduce((obj, area) => ({
            ...obj,
            ...{
              [area]: this.researchAttributesAreas[area].map((attr) => attr._id)
            }
          }), {});

        clonedProfile.settings.researchAttributesAreas = updatedAreas;

        tenantService.updateTenantProfile(clonedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = this.$env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
            this.$router.push({
              name: 'admin.attributes'
            });
            this.processing = false;
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
            this.processing = false;
          });
      }
    }
  };
</script>
