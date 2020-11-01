import { mapGetters } from 'vuex';
import { isArray, isObject, isString } from '@/utils/helpers';
import { BlockchainService } from '@deip/blockchain-service';

const blockchainService = BlockchainService.getInstance();

function toAssetUnits(
  amount,
  precision = 3,
  asset = this.$env.ASSET_UNIT
) {
  return blockchainService.toAssetUnits(
    amount,
    precision,
    asset
  );
}

export const assetsChore = {
  computed: {
    ...mapGetters({
      assets: 'auth/assets'
    })
  },

  methods: {
    $$assetInfo(id) {
      return this.assets.find((ass) => ass.id === id);
    },

    $$toAssetUnits(val) {
      if (!val) return null;

      if (isString(val)) {
        return toAssetUnits.call(this, val);
      }

      if (isArray(val)) {
        return toAssetUnits.call(this, ...val);
      }

      if (isObject(val)) {
        const { amount, assetId } = val;

        if (amount === undefined && assetId === undefined) return null;

        const asset = this.$$assetInfo(assetId);

        return asset ? toAssetUnits.call(
          this,
          amount,
          asset.precision,
          asset.string_symbol
        ) : null;
      }

      throw new Error('Unknown asset format');
    }
  }
};
