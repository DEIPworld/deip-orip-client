import { mapGetters } from 'vuex';
import { BlockchainService } from '@deip/blockchain-service';
import {
  fileNameFromUrl, isArray, isObject, isString
} from '@/utils/helpers';

import ColorThief from 'colorthief/dist/color-thief.mjs';
import chroma from 'chroma-js';

const blockchainService = BlockchainService.getInstance();

export const assetsChore = {
  computed: {
    ...mapGetters({
      assets: 'auth/assets'
    })
  },

  methods: {

    assetInfo(id) {
      return this.assets.find((ass) => ass.id === id);
    },

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

      if (isString(val)) {
        return this.toAssetUnits$(val);
      }

      if (isArray(val)) {
        return this.toAssetUnits$(...val);
      }

      if (isObject(val)) {
        const { amount, assetId } = val;

        if (amount === undefined && assetId === undefined) return null;

        const asset = this.assetInfo(assetId);

        return asset ? this.toAssetUnits$(
          amount,
          asset.precision,
          asset.string_symbol
        ) : null;
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
        { icon: 'mdi-file-powerpoint-outline', ext: [] }
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

export const colorChores = {
  methods: {
    genTempImage(imageURL) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
      // img.src = googleProxyURL + encodeURIComponent(imageURL);
      img.src = imageURL;

      return img;
    },

    getDominantColor(imageURL) {
      const colorThief = new ColorThief();
      const image = this.genTempImage(imageURL);

      return new Promise((resolve, reject) => {
        try {
          image.addEventListener('load', () => {
            resolve(colorThief.getColor(image));
          });
        } catch (err) {
          reject(err);
        }
      });
    },

    rgbToHex(rgb) {
      return chroma(rgb).hex();
    },

    isDarkColor(color = '#000') {
      // console.log(color, chroma(color).luminance())
      return chroma(color).luminance() < 0.5;
    }
  }
};
