<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import { stripHtml } from '@/utils/helpers';

  export default {
    name: 'AttributesTextareaRead',
    mixins: [attributeRead],
    props: {
      clamped: {
        type: [Number, String],
        default: null
      }
    },
    methods: {
      genContent(h) {
        if (this.clamped) {
          return h('v-clamp', {
            props: {
              autoresize: true,
              // eslint-disable-next-line radix
              maxLines: parseInt(this.clamped)
            }
          }, stripHtml(this.attribute.value));
        }

        return h('div', {
          domProps: {
            innerHTML: this.attribute.value
          }
        });
      }
    }
  };
</script>
