import * as jsPDF from 'jspdf-yworks';

const renderText = (
  ctx,
  text,
  {
    x = 0,
    y = 0,
    color = '#00000',
    fontSize = 14,
    font = 'helvetica',
    maxWidth = 0
  }
) => {
  const textLines = ctx.setFont(font)
    .setFontSize(fontSize)
    .setTextColor(color)
    .splitTextToSize(text, maxWidth);

  ctx.text(textLines, x, y + fontSize);
  return textLines.length * fontSize;
};

const saveKeysPdf = (
  username,
  {
    ownerPrivateKey,
    ownerPublicKey
  },
  filename = 'oa_keys.pdf'
) => {
  if (!username || !ownerPrivateKey || !ownerPublicKey) {
    throw new Error('Not all agruments are specified');
  }

  const TITLE_COLOR = '#9E9E9E';
  const TEXT_COLOR = '#000000';
  const HEIGHT = 842; // a4 px height
  const WIDTH = 595; // a4 px width

  const doc = new jsPDF({
    orientation: 'portrait',
    format: [WIDTH, HEIGHT],
    unit: 'px'
  }).setProperties({ title: filename });

  const TITLE_MARGIN = 85;
  const TEXT_MARGIN = 182;
  const TEXT_MAX_WIDTH = 320;
  const TITLE_MAX_WIDTH = 77;

  let offset = 94;
  renderText(doc, 'Username:', {
    x: TITLE_MARGIN,
    y: offset,
    color: TITLE_COLOR,
    maxWidth: TITLE_MAX_WIDTH
  });

  offset += renderText(doc, username, {
    x: TEXT_MARGIN,
    y: offset,
    color: TEXT_COLOR,
    maxWidth: TEXT_MAX_WIDTH
  });

  offset += 20;

  renderText(doc, 'Private key:', {
    x: TITLE_MARGIN,
    y: offset,
    color: TITLE_COLOR,
    maxWidth: TITLE_MAX_WIDTH
  });

  offset += renderText(doc, ownerPrivateKey, {
    x: TEXT_MARGIN,
    y: offset,
    color: TEXT_COLOR,
    maxWidth: TEXT_MAX_WIDTH
  });

  offset += 20;

  renderText(doc, 'Public key:', {
    x: TITLE_MARGIN,
    y: offset,
    color: TITLE_COLOR,
    maxWidth: TITLE_MAX_WIDTH
  });

  renderText(doc, ownerPublicKey, {
    x: TEXT_MARGIN,
    y: offset,
    color: TEXT_COLOR,
    maxWidth: TEXT_MAX_WIDTH
  });

  doc.save(filename);
};

export {
  saveKeysPdf
};
