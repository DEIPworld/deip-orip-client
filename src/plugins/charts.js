import chroma from 'chroma-js';
import chunk from 'chunk';

export const chartPalette = {
  core: [
    '#BBF3A7',
    '#9BE7BA',
    '#72DBCC',
    '#23CFDE',
    '#3BB9DD',
    '#46A4DC',
    '#4C8EDA',
    '#4D79D9',
    '#5569ED',
    '#4845AD',
    '#412885',
    '#37055F'
  ],
  info: [
    '#CCEEFF',
    '#9ADDFF',
    '#67CCFF',
    '#35BBFF',
    '#02AAFF',
    '#0288CC',
    '#016699',
    '#014466'
  ]
};

export const chartGradient = (num = 24) => {
  const palette = chroma.scale(
    ['#feff9a', '#7eccbb', '#4cb1d0', '#5569ed', '#6846c0']
    // ['#feff9a', '#7eccbb', '#4cb1d0', '#5569ed']
  )
    .mode('rgb')
    .correctLightness()
    .colors(num * 101);
  const chunks = chunk(palette, 101);
  const result = [];
  for (const c of chunks) {
    result.push(c[51]);
  }

  return result;
};

export const switchColor = (bg = '#000') => {
  return chroma(bg).luminance() > 0.5
    ? chroma(bg).darken(3 - 0.5 * chroma(bg).luminance()).hex()
    : chroma(bg).brighten(3 - 0.5 * chroma(bg).luminance()).hex();
};
