import ColorThief from 'colorthief';
import chroma from 'chroma-js';

export const colorChore = {
  methods: {
    genTempImage(imageURL) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      // const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
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
      return chroma(color).luminance() < 0.5;
    }
  }
};
