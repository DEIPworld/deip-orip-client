import { mapGetters } from 'vuex';
import { BlockchainService } from '@deip/blockchain-service';
import { fileNameFromUrl, isArray, isObject, isString } from '@/utils/helpers';

const blockchainService = BlockchainService.getInstance();

export const assetsChore = {
  computed: {
    ...mapGetters({
      assets: 'auth/assets'
    })
  },

  methods: {

    toAssetUnits$(
      amount,
      precision = 3,
      asset = this.$env.ASSET_UNIT
    ) {
      return blockchainService.toAssetUnits(
        amount,
        precision,
        asset
      );
    },

    toAssetString(val) {
      if (!val) return null;

      if(isString(val)) {
        return this.toAssetUnits$(val);
      }

      if (isArray(val)) {
        return this.toAssetUnits$(...val);
      }

      if (isObject(val)) {
        const { amount, assetId } = val;
        console.log(val, amount, assetId)

        if (!(amount && assetId)) return null;

        const asset = this.assets.find((ass) => ass.id === assetId);

        return this.toAssetUnits$(
          amount,
          asset.precision,
          asset.string_symbol
        );
      }

      throw new Error('Unknown asset format');
    }
  }
};

export const filesChore = {
  data() {
    return {
      iconsMap: [
        { icon: 'mdi-file-image-outline', ext: ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif'] },
        { icon: 'mdi-file-document-outline', ext: [] },
        { icon: 'mdi-file-excel-outline', ext: [] },
        { icon: 'mdi-file-table-outline', ext: [] },
        { icon: 'mdi-file-pdf-outline', ext: [] },
        { icon: 'mdi-file-powerpoint-outline', ext: [] },
      ]
    };
  },
  methods: {
    fileIcon(name) {
      if (!name) return false;

      const target = this.iconsMap
        .find((item) => item.ext.includes(name.split('.').pop()));

      if (!target) return 'mdi-file-outline';

      return target.icon;
    },
    fileNameFromUrl(url) {
      return fileNameFromUrl(url);
    }
  }
};
