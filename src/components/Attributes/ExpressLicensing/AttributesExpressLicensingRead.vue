<template>
  <div class="ma-n6">
    <template
      v-if="project.members.includes($currentUser.username)"
    >
      <d-block-widget
        title="Licensee"
      >
        <express-licensing-licensee
          :licenses="project.researchRef.expressLicenses"
        />
      </d-block-widget>
    </template>

    <template v-if="!project.members.includes($currentUser.username) && attrHasData">
      <template
        v-if="userLicenses.length"
      >
        <d-block-widget
          title="Purchased licenses"
          widget
        >
          <express-licensing-purchased
            :licenses="userLicenses"
          />
        </d-block-widget>
      </template>

      <d-block-widget
        :title="attributeInfo.title"
      >
        <express-licensing-purchase
          :attribute-id="attribute.attributeId"
          :licenses="attribute.value"
          :project="project"
        />
      </d-block-widget>
    </template>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import ExpressLicensingPurchase from '@/components/Licensing/Express/ExpressLicensingPurchase';
  import ExpressLicensingLicensee from '@/components/Licensing/Express/ExpressLicensingLicensee';
  import ExpressLicensingPurchased from '@/components/Licensing/Express/ExpressLicensingPurchased';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';

  export default {
    name: 'AttributesExpressLicensingRead',
    components: {
      DBlockWidget,
      ExpressLicensingPurchased,
      ExpressLicensingLicensee,
      ExpressLicensingPurchase
    },
    mixins: [attributeRead],

    props: {
      project: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      userLicenses() {
        return this.$where(this.project.researchRef.expressLicenses, { owner: this.$currentUser.username });
      }
    }
  };
</script>
