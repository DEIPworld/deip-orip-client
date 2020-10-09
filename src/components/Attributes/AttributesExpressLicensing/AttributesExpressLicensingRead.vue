<template>
  <d-stack :gap="16">
    <v-radio-group
      v-model="selected"
      class="pa-0 ma-0"
      hide-details="auto"
    >
      <v-list v-if="attrHasData" nav class="pa-0">

        <v-list-item
          v-for="(item, index) of attribute.value"
          :key="`lic-${index}`"
          class="mx-n2"
          link
          @click="selected = item"
        >
          <v-list-item-action class="mr-4 my-2">
            <v-radio :value="item" />
          </v-list-item-action>

          <v-list-item-content class="text-caption">
            {{ item.name }}
          </v-list-item-content>

          <v-list-item-action-text class="text--primary font-weight-medium">
            {{ toAssetString(item.fee) }}
          </v-list-item-action-text>
        </v-list-item>


      </v-list>
    </v-radio-group>
    <v-btn
      block
      small
      outlined
      color="primary"
      :disabled="!selected"
      @click="dialog = true"
    >
      Buy a licence
    </v-btn>
<!--    <d-dialog v-model="dialog">www</d-dialog>-->
    <ve-dialog v-model="dialog">
      test test
    </ve-dialog>
  </d-stack>

</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import { assetsChore } from '@/mixins/chores';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesExpressLicensingRead',
    components: { DStack },
    mixins: [attributeRead, assetsChore],
    data() {
      return {
        selected: null,
        dialog: false,
      };
    },
    created() {
      this.$confirm('Do you really want to exit?', { title: 'Dialog window' }).then((res) => {
        console.log(res)
      })
    }
  };
</script>
