import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';

export const abstractNode = {
  components: {
    // NOTE: Fix for recursive call
    AdminLayoutsComposerNodes: () => import('@/components/AdminPanel/Layouts/Composer/Nodes/AdminLayoutsComposerNodes')
  },
  mixins: [ProxyableFactory('node')],
  computed: {
    title() {
      const propTitle = this.node.props ? (this.node.props.title || this.node.props.label || null) : null;
      const attrTitle = this.node.attrs ? (this.node.attrs.title || null) : null;
      return propTitle || attrTitle || null;
    },
    icon() {
      if (this.node.props) {
        return this.node.props.icon || this.node.icon;
      }
      return this.node.icon;
    }
  },
  methods: {
    onClickRemove(e) {
      this.$emit('click:remove', e);
    }
  }
};
