<template>
  <div>
    <template
      v-if="project.members.includes($currentUserName)"
    >
      <d-block
        title="Licensee"
        widget
      >
        <express-licensing-licensee
          :licenses="project.researchRef.expressLicenses"
        />
      </d-block>
      <v-divider />
    </template>


    <template v-if="!project.members.includes($currentUserName) && attrHasData">

      <template
        v-if="userLicenses.length"
      >
        <d-block
          title="Purchased licenses"
          widget
        >
          <express-licensing-purchased
            :licenses="userLicenses"
          />
        </d-block>
      </template>
      <v-divider />
      <d-block
        :title="attributeInfo.title"
        widget
      >
        <express-licensing-purchase
          :attribute-id="attribute.researchAttributeId"
          :licenses="attribute.value"
          :project="project"
        />
      </d-block>
    </template>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import ExpressLicensingPurchase from '@/components/Licensing/Express/ExpressLicensingPurchase';
  import ExpressLicensingLicensee from '@/components/Licensing/Express/ExpressLicensingLicensee';
  import ExpressLicensingPurchased from '@/components/Licensing/Express/ExpressLicensingPurchased';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesExpressLicensingRead',
    components: {
      DBlock,
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
        return this.$where(this.project.researchRef.expressLicenses, { owner: this.$currentUserName });
      }
    }
  };
</script>
