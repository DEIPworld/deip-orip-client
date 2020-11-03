import { mapGetters } from 'vuex';
import { isArray, isObject, isString } from '@/utils/helpers';

export const assetsChore = {
  computed: {
    ...mapGetters({
      assets: 'auth/assets'
    })
  },

  methods: {
    $$assetInfo(assetId) {
      // return this.assets.find((ass) => ass.string_symbol);
      return this.assets.find((ass) => (ass.string_symbol === assetId || ass.id === assetId));
    },

    $$fromAssetUnits(val) {
      // /\d+[.]{1}\d+\s[a-zA-Z0-9]+/ - для цифры-точка-цифры-пробел-буквы_с_цифрами
      // /\d+[.]{1}\d+\s[a-zA-Z]+/ - для цифры-точка-цифры-пробел-только_буквы

      const matches = val.match(/(\d+)[.]{1}(\d+)\s([a-zA-Z]+)/);
    },

    $$toAssetUnits(val, formatted = true) {
      if (!val) return null;

      const formatOptions = {
        fractionCount: 3,
        symbol: this.$env.ASSET_UNIT,

        thousandsSeparator: formatted ? ',' : '',
        symbolPosition: false,
        symbolSpacing: true
      };

      if (isString(val)) {
        return this.$options.filters.currency(val, formatOptions);
      }

      if (isArray(val)) {
        // amount, precision, asset,
        return this.$options.filters.currency(val[0], {
          ...formatOptions,
          ...{
            fractionCount: val[2],
            symbol: val[1]
          }
        });
      }

      if (isObject(val)) {
        const { amount, assetId } = val;

        if (amount === undefined && assetId === undefined) return null;

        const asset = this.$$assetInfo(assetId);

        return asset ? this.$options.filters.currency(amount, {
          ...formatOptions,
          ...{
            fractionCount: asset.precision,
            symbol: asset.string_symbol
          }
        }) : null;
      }

      throw new Error('Unknown asset format');
    }
  }
};
