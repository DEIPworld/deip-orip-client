<template>
  <v-card
    outlined
    class="dashed d-flex"
    max-width="100%"
    min-width="0px"
  >
    <v-sheet color="grey lighten-4" class="d-flex align-center">
      <v-icon v-if="!(node.props && node.props.title)" class="pa-2">
        {{ icon }}
      </v-icon>

      <v-sheet
        v-if="node.props && node.props.title"
        class="pa-2 text-caption font-weight-medium text--secondary text-truncate"
        color="transparent"
        :min-width="0"
      >
        {{ node.props.title }}
      </v-sheet>
    </v-sheet>

    <v-divider vertical class="dashed" />

    <div v-if="node.text" class="py-2 px-3 text-body-2 font-weight-medium align-self-center text--secondary">
      {{ node.text }}
    </div>

    <admin-layouts-composer-nodes
      v-if="node.children"
      v-model="node.children"
      class="pa-1 spacer"
      @click:remove="onClickRemove"
      style="max-width: 100%; min-width: 0px"
    />

    <template v-if="$hasSlot('settings')">
      <v-sheet class="pa-2 align-self-center">
        <slot name="settings" />
      </v-sheet>
    </template>
  </v-card>
</template>

<script>
  import { abstractNode } from '@/components/AdminPanel/Layouts/Composer/Node/Types/mixins';

  export default {
    name: 'AdminLayoutsComposerNodeTypography',
    mixins: [abstractNode]
  };
</script>
