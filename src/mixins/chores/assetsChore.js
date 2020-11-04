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

      const matches = val.match(/^(\d+\.\d+)\s([a-zA-Z]+)/);

      const stringAmount = matches[1];
      const amount = stringAmount ? parseFloat(stringAmount) : 0;
      const precision = stringAmount ? stringAmount.split('.')[1].length : 3;
      const assetId = matches[2] || this.$env.ASSET_UNIT;

      return {
        stringAmount,
        amount,
        precision,
        assetId
      };
    },

    $$formatOpts(obj = {}, options = {}, formatted = true) {
      const formatOptions = {
        fractionCount: 3,
        symbol: this.$env.ASSET_UNIT,

        thousandsSeparator: formatted ? ',' : '',
        symbolPosition: false,
        symbolSpacing: true
      };

      return {
        ...formatOptions,
        ...obj,
        ...options
      };
    },

    $$toAssetUnits(val, formatted = true, options = {}) {
      if (!val) return null;

      const formatOptions = {
        fractionCount: 3,
        symbol: this.$env.ASSET_UNIT,

        thousandsSeparator: formatted ? ',' : '',
        symbolPosition: false,
        symbolSpacing: true
      };

      if (isString(val)) {
        return this.$options.filters
          .currency(val, this.$$formatOpts({}, options, formatted));
      }

      if (isArray(val)) {
        // amount, precision, asset,
        return this.$options.filters
          .currency(val[0], this.$$formatOpts({
            fractionCount: val[2],
            symbol: val[1]
          }, options, formatted));
      }

      if (isObject(val)) {
        const { amount, assetId } = val;

        if (amount === undefined && assetId === undefined) return null;

        const asset = this.$$assetInfo(assetId);

        return asset
          ? this.$options.filters
            .currency(amount, this.$$formatOpts({
              fractionCount: asset.precision,
              symbol: asset.string_symbol
            }, options, formatted))
          : null;
      }

      throw new Error('Unknown asset format');
    }
  }
};
