import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';

export const abstractNode = {
  components: {
    // NOTE: Fix for recursive call
    AdminLayoutsComposerNodes: () => import('@/components/AdminPanel/Layouts/Composer/Nodes/AdminLayoutsComposerNodes')
  },
  mixins: [ProxyableFactory('node')],
  computed: {
    title() {
      const propTitle = this.node.props ? (this.node.props.title || this.node.props.label || this.node.props.tooltip || null) : null;
      const attrTitle = this.node.attrs ? (this.node.attrs.title || null) : null;
      return propTitle || attrTitle || null;
    },
    icon() {
      if (this.node.props && this.node.props.icon) {
        return this.node.props.icon;
      }
      if (this.node.component === 'VIcon' && this.node.text) {
        return this.node.text;
      }
      return this.node.icon;
    },
    nodeDataAttrs() {
      const data = {
        ...(this.node.props || {}),
        ...(this.node.attrs || {}),
      };
      return Object.keys(data).map((item) => ({
        [`data-${item}`]: data[item]
      }));
    }
  },
  methods: {
    onClickRemove(e) {
      this.$emit('click:remove', e);
    }
  }
};
