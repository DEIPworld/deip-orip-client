import chroma from 'chroma-js';
import chunk from 'chunk';

export const chartGradient = (num = 24, debug = false) => {
  const palette = chroma.scale(
    ['#feff9a', '#7eccbb', '#4cb1d0', '#5569ed', '#6846c0']
  )
    .mode('rgb')
    .correctLightness()
    .colors(num * 101);
  const chunks = chunk(palette, 101);
  const result = [];
  for (const c of chunks) {
    result.push(c[51]);
  }

  if (debug) {
    console.info(num);
    console.info(result);
  }

  return result;
};

export const switchColor = (bg = '#000') => {
  const dark = chroma(bg).darken(3 - 0.1 * chroma(bg).luminance()).hex();
  const light = chroma(bg).brighten(3 - 0.1 * chroma(bg).luminance()).hex();

  return chroma(bg).luminance() > 0.5 ? dark : light;
};
