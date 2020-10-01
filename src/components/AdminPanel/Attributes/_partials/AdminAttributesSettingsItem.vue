<template>
  <v-sheet
    class="mb-2"
    style="cursor: move"
    outlined
    rounded
  >
    <v-list-item>
      <v-list-item-action class="ml-n2 mr-1">
        <v-icon class="ma-auto" small>
          drag_indicator
        </v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <div class="text-caption text-truncate font-weight-medium">
          {{ attribute.title }}
        </div>
      </v-list-item-content>
      <v-list-item-action class="mr-0 justify-end">
        <d-stack horizontal gap="4">
          <d-simple-tooltip
            v-if="!attribute.isEditable"
            tag="div"
            tooltip="System attribute"
          >
            <v-icon small class="d-flex">
              mdi-application-cog
            </v-icon>
          </d-simple-tooltip>
          <d-simple-tooltip
            tag="div"
            :tooltip="attribute.isPublished ? 'Published' : 'Unpublished'"
          >
            <v-icon small class="d-flex">
              {{ attribute.isPublished ? 'flag' : 'outlined_flag' }}
            </v-icon>
          </d-simple-tooltip>
        </d-stack>
      </v-list-item-action>
      <template v-if="$hasSlot('actions')">
        <v-list-item-action class="mr-n2">
          <slot name="actions" />
        </v-list-item-action>
      </template>

    </v-list-item>
  </v-sheet>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'AdminAttributesSettingsItem',
    components: { DSimpleTooltip, DStack },
    props: {
      attribute: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
