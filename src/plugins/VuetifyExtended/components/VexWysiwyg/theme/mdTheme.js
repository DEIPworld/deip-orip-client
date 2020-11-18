import extend from 'extend';
import Emitter from 'quill/core/emitter';
import BaseTheme, { BaseTooltip } from 'quill/themes/base';
import LinkBlot from 'quill/formats/link';
import { Range } from 'quill/core/selection';

import './mdTheme_gate.styl';
import './mdTheme.scss';

import {
  mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignRight,
  mdiFormatAlignJustify, mdiFormatColorFill, mdiFormatColorText,
  mdiFormatBold, mdiFormatItalic, mdiFormatStrikethrough,
  mdiCodeBraces, mdiCodeJson, mdiFormatTextdirectionLToR,
  mdiFormatTextdirectionRToL, mdiFormatFloatLeft, mdiFormatFloatCenter,
  mdiFormatFloatRight, mdiViewDayOutline, mdiFunctionVariant,
  mdiFormatQuoteClose, mdiFormatClear, mdiFormatHeader1,
  mdiFormatHeader2, mdiFormatHeader3, mdiFormatHeader4,
  mdiFormatHeader5, mdiFormatHeader6, mdiImageFrame,
  mdiFormatIndentIncrease, mdiFormatIndentDecrease, mdiLinkVariant,
  mdiFormatListNumbered, mdiFormatListBulleted, mdiFormatListCheckbox,
  mdiFormatSubscript, mdiFormatSuperscript, mdiFormatUnderline, mdiVideoOutline
} from '@mdi/js';

const genIcon = (path) => `<svg viewbox="0 0 24 24"><path d="${path}" /></svg>`;

const icons = {
  align: {
    '': genIcon(mdiFormatAlignLeft),
    center: genIcon(mdiFormatAlignCenter),
    right: genIcon(mdiFormatAlignRight),
    justify: genIcon(mdiFormatAlignJustify)
  },

  bold: genIcon(mdiFormatBold),
  italic: genIcon(mdiFormatItalic),
  strike: genIcon(mdiFormatStrikethrough),
  underline: genIcon(mdiFormatUnderline),

  background: genIcon(mdiFormatColorFill),
  color: genIcon(mdiFormatColorText),

  direction: {
    '': genIcon(mdiFormatTextdirectionLToR),
    rtl: genIcon(mdiFormatTextdirectionRToL)
  },

  float: {
    left: genIcon(mdiFormatFloatLeft),
    center: genIcon(mdiFormatFloatCenter),
    right: genIcon(mdiFormatFloatRight),
    full: genIcon(mdiViewDayOutline)
  },

  indent: {
    '+1': genIcon(mdiFormatIndentIncrease),
    '-1': genIcon(mdiFormatIndentDecrease)
  },

  header: {
    1: genIcon(mdiFormatHeader1),
    2: genIcon(mdiFormatHeader2),
    3: genIcon(mdiFormatHeader3),
    4: genIcon(mdiFormatHeader4),
    5: genIcon(mdiFormatHeader5),
    6: genIcon(mdiFormatHeader6)
  },

  code: genIcon(mdiCodeBraces),
  'code-block': genIcon(mdiCodeJson),
  blockquote: genIcon(mdiFormatQuoteClose),
  image: genIcon(mdiImageFrame),
  link: genIcon(mdiLinkVariant),
  list: {
    ordered: genIcon(mdiFormatListNumbered),
    bullet: genIcon(mdiFormatListBulleted),
    check: genIcon(mdiFormatListCheckbox)
  },
  script: {
    sub: genIcon(mdiFormatSubscript),
    super: genIcon(mdiFormatSuperscript)
  },
  formula: genIcon(mdiFunctionVariant),
  video: genIcon(mdiVideoOutline),
  clean: genIcon(mdiFormatClear)
};

export const TOOLBAR_CONFIG = [
  [{ header: [false, 1, 2, 3, 4, 5, 6] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['link', 'image', 'video'],
  [
    { list: 'ordered' },
    { list: 'bullet' },
    { indent: '-1' },
    { indent: '+1' }],
  ['clean']
];

class MdTooltip extends BaseTooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
    this.preview = this.root.querySelector('a.ql-preview');
  }

  listen() {
    super.listen();
    this.root.querySelector('a.ql-action').addEventListener('click', (event) => {
      if (this.root.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit('link', this.preview.textContent);
      }
      event.preventDefault();
    });
    this.root.querySelector('a.ql-remove').addEventListener('click', (event) => {
      if (this.linkRange != null) {
        const range = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, 'link', false, Emitter.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range, oldRange, source) => {
      if (range == null) return;
      if (range.length === 0 && source === Emitter.sources.USER) {
        const [link, offset] = this.quill.scroll.descendant(LinkBlot, range.index);
        if (link != null) {
          this.linkRange = new Range(range.index - offset, link.length());
          const preview = LinkBlot.formats(link.domNode);
          this.preview.textContent = preview;
          this.preview.setAttribute('href', preview);
          this.show();
          this.position(this.quill.getBounds(this.linkRange));
          return;
        }
      } else {
        delete this.linkRange;
      }
      this.hide();
    });
  }

  show() {
    super.show();
    this.root.removeAttribute('data-mode');
  }
}
MdTooltip.TEMPLATE = [
  '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');

class MdTheme extends BaseTheme {
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      // eslint-disable-next-line no-param-reassign
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-md');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-md');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons);
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons);
    this.tooltip = new MdTooltip(this.quill, this.options.bounds);
    if (toolbar.container.querySelector('.ql-link')) {
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, (range, context) => {
        toolbar.handlers.link.call(toolbar, !context.format.link);
      });
    }
  }
}
MdTheme.DEFAULTS = extend(true, {}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (value) {
            const range = this.quill.getSelection();
            if (range == null || range.length === 0) return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = `mailto:${preview}`;
            }
            const { tooltip } = this.quill.theme;
            tooltip.edit('link', preview);
          } else {
            this.quill.format('link', false);
          }
        }
      }
    }
  }
});

export default MdTheme;
