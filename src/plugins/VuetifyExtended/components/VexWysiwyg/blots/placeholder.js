import Quill from 'quill/quill';

const Embed = Quill.import('blots/embed');
const Parchment = Quill.import('parchment');

export function createPlaceholderBlot() {
  class PlaceholderBlot extends Embed {
    static blotName = 'placeholderData';

    static tagName = 'span';

    static className = 'ql-placeholder';

    static delimiters = []

    static create(value) {
      const node = super.create(value);

      if (value.required) node.setAttribute('data-required', 'true');
      node.setAttribute('data-id', value.id);
      node.setAttribute('data-label', value.label);
      node.setAttribute('spellcheck', 'false');

      const { delimiters } = PlaceholderBlot;
      const label = typeof delimiters === 'string'
        ? `${delimiters}${value.label}${delimiters}`
        : `${delimiters[0]}${value.label}${delimiters[1] || delimiters[0]}`;

      const labelNode = document.createTextNode(label);

      node.appendChild(labelNode);

      return node;
    }

    static value(domNode) {
      return domNode.dataset;
    }

    static length() {
      return 1;
    }

    deleteAt(index, length) {
      if (!this.domNode.dataset.required) {
        console.log('del')
        super.deleteAt(index, length);
      }
    }
  }

  return PlaceholderBlot;
}

export function createPlaceholderModule() {
  const PlaceholderBlot = createPlaceholderBlot();

  Quill.register(PlaceholderBlot);

  class PlaceholderModule {
    constructor(quill, options) {
      PlaceholderBlot.delimiters = options.delimiters || ['', ''];

      this.quill = quill;
      this.onTextChange = this.onTextChange.bind(this);
      this.onClick = this.onClick.bind(this);

      this.quill.on('text-change', this.onTextChange);
      this.quill.root.addEventListener('click', this.onClick);
    }

    onTextChange(_, oldDelta, source) {
      if (source === Quill.sources.USER) {
        const currentContents = this.quill.getContents();
        const delta = currentContents.diff(oldDelta);

        const shouldRevert = delta.ops.filter((op) => op.insert
          && op.insert.placeholderData && op.insert.placeholderData.required).length;

        if (shouldRevert) {
          this.quill.updateContents(delta, Quill.sources.SILENT);
        }
      }
    }

    onClick(ev) {
      const blot = Parchment.find(ev.target.parentNode);

      if (blot instanceof PlaceholderBlot) {
        const index = this.quill.getIndex(blot);
        this.quill.setSelection(index, blot.length(), Quill.sources.USER);
      }
    }
  }

  return PlaceholderModule;
}
