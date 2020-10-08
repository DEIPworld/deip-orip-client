import { mapGetters } from 'vuex';
import { BlockchainService } from '@deip/blockchain-service';
import { isArray, isObject, isString } from '@/utils/helpers';

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
