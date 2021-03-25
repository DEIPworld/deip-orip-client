<template>
  <div
    v-if="attrIsRead || attrIsSet"
    class="d-flex"
  >
    <v-menu v-model="menuOpen" close-on-content-click>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          x-small
          v-on="on"
        >
          <v-icon size="12" class="ma-0">
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>

      <v-list nav dense>
        <v-list-item
          v-for="(item, index) of menuList"
          :key="index"
          @click="item.action()"
        >
          <v-list-item-icon class="mr-1">
            <v-icon size="20">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content class="text-body-2">
            {{ item.label }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import { ATTR_TYPES } from '@/variables';
  import { attributesChore } from '@/mixins/chores/attributesChore';

  export default {
    name: 'AdminLayoutsModulesMenu',
    mixins: [attributesChore],
    props: {
      module: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        menuOpen: false,
        ATTR_TYPES
      };
    },
    computed: {
      attrId() {
        return this.module.props && this.module.props.attribute
          ? this.module.props.attribute.split('.').slice(-1).pop()
          : null;
      },
      attrInfo() {
        return this.$$projectAttributes.find((attr) => attr._id === this.attrId);
      },

      attrIsRead() {
        return this.module.component === 'AttributesRead';
      },

      attrIsSet() {
        return this.module.component === 'AttributesSet';
      },

      menuList() {
        return [
          {
            icon: 'mdi-pound-box-outline',
            label: 'Copy attribute ID',
            action: () => { this.$clipboard(this.attrId); }
          },

          {
            icon: 'mdi-text-box-multiple-outline',
            label: 'Copy attribute value',
            action: () => { this.$clipboard(`@attributeValue('${this.attrId}')`); }
          },

          {
            icon: 'mdi-clipboard-text-multiple-outline',
            label: 'Copy attribute data',
            action: () => { this.$clipboard(`@getAttribute('${this.attrId}')`); }
          },

          ...(this.attrIsRead
            ? [{
              icon: 'mdi-checkbox-multiple-marked-outline',
              label: 'Copy attribute condition',
              action: () => { this.$clipboard(`this.ifAttribute('${this.attrId}')`); }
            }] : []),

          ...(this.attrIsRead && this.attrInfo.type === ATTR_TYPES.IMAGE
            ? [{
              icon: 'mdi-image-multiple-outline',
              label: 'Copy image url',
              action: () => { this.$clipboard(`@getImageUrl('${this.attrId}')`); }
            }] : [])
        ];
      }
    }
  };
</script>
