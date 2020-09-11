import kindOf from 'kind-of';
import { findAndReplaceIf as replace } from 'find-and-replace-anything';
import { getObjectValueByPath } from 'vuetify/lib/util/helpers';

import DLayout from '@/components/Deipify/DLayout/DLayout';

const rendererCommon = {
  props: {
    schema: {
      type: Array,
      default: () => []
    },
    tag: {
      type: String,
      default: 'd-layout'
    }
  },
  components: {
    DLayout
  },
  methods: {
    replaceFn(val) {
      const stringPattern = /{{\s*(.*?)\s*}}/gm;
      const modelPattern = /^@([a-zA-Z0-9_.-]*)$/;

      if (kindOf(val) === 'string') {
        const stringMatches = [...val.matchAll(stringPattern)];
        const modelMatches = val.match(modelPattern);

        if (modelMatches && modelMatches.length) {
          return getObjectValueByPath(this, modelMatches[1]);
        }

        if (stringMatches && stringMatches.length) {
          return val.replace(stringPattern, (...args) => getObjectValueByPath(this, args[1]));
        }

        return val;
      }

      return val;
    },

    normalizeSchema(children = null) {
      if (kindOf(children) === 'string') {
        return replace(children, this.replaceFn);
      }

      if (kindOf(children) === 'array') {
        return children.map((node) => ({
          ...replace(node, this.replaceFn),
          ...(node.children ? {
            children: this.normalizeSchema(node.children)
          } : {})
        }));
      }

      if (kindOf(children) === 'object') {
        throw new Error('Children must be an Array');
      }

      return children;
    }
  }
};

export const nativeRenderer = {
  mixins: [
    rendererCommon
  ],

  methods: {
    getChildren(children = null, h) {
      if (kindOf(children) === 'array') {
        return children.map((n) => this.generateNode(n, h));
      }

      if (kindOf(children) === 'string') {
        return children;
      }

      throw new Error('Children must be an Array or String');
    },

    generateNode(node, h) {
      const data = { ...(node.data || {}) };
      const condition = Object.prototype.hasOwnProperty.call(node, 'if') ? node.if : true;
      return condition !== 'false' ? h(
        node.is,
        data,
        this.getChildren(node.children, h)
      ) : null;
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema)
        .map((n) => this.generateNode(n, h))
    );
  }
};

export const componentsRenderer = {
  mixins: [
    rendererCommon
  ],

  methods: {
    getChildren(children = null, h) {
      if (children) {
        if (kindOf(children) === 'array') {
          return children.map((n) => this.generateNode(n, h));
        }

        throw new Error('Children must be an Array');
      };

      return null;
    },

    generateNode(node, h) {
      const data = {
        ...(node.props ? { props: node.props } : {}),
        ...(node.class ? { class: node.class } : {}),
        ...(node.slot ? { slot: node.slot } : {})
      };

      const isStringNode = kindOf(node) === 'string';

      const component = isStringNode ? node : node.component;

      let content = this.getChildren(node.children, h);

      if (node.text) {
        content = node.text;
      }
      if (isStringNode) {
        content = null;
      }

      return h(
        component,
        data,
        content
      );
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema)
        .map((n) => this.generateNode(n, h))
    );
  }
};
