<script>
  import { vSheetModify } from '@/mixins/vSheetModify';
  import { VImg, VOverlay } from 'vuetify/lib/components';

  export default {
    name: 'DLayoutSection',
    components: {
      VImg,
      VOverlay
    },
    mixins: [vSheetModify],
    props: {
      background: {
        type: String,
        default: null
      },
      backgroundOverlay: {
        type: String,
        default: null
      },
      alignContent: {
        type: String,
        default: 'stretch'
      }
    },
    computed: {
      additionalClasses() {
        return {
          'd-flex': true,
          [`align-${this.alignContent}`]: true
        };
      },
      additionalStyles() {
        return {
          position: 'relative',
          zIndex: 1
        };
      },
      additionalChildren() {
        const img = ['v-img', {
          props: {
            src: this.background,
            gradient: this.backgroundOverlay || null,
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            maxWidth: '100%',
            aspectRatio: 0,
          },
          style: {
            position: 'absolute',
            zIndex: '-1'
          }
        }, null];

        return [
          ...(this.background ? [img] : [])
        ];
      }
    }
  };
</script>
