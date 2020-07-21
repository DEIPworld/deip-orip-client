import DBlock from '@/components/Deipify/DBlock/DBlock';
import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

export const ResearchListAbstractFilter = {
  components: {
    DBlock,
    DListExpand
  },

  props: {
    value: {
      type: [Array, Object, String, Number],
      default: undefined
    }
  },

  computed: {
    localModel: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
};
