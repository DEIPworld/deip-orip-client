<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import {} from 'vuetify/lib/util/helpers'
  import { stripHtml } from '@/utils/helpers';

  export default {
    name: 'AttributesTextareaRead',
    mixins: [attributeRead],
    methods: {
      genContent(h) {
        console.log(this.attribute.value)
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
