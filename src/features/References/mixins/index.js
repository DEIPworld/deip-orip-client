import { componentStoreFactory } from '@/mixins/registerStore';
import { referencesListStore } from '@/features/References/store/referencesListStore';
import { mapState } from 'vuex';

export const referencesList = {
  name: 'contentList',

  mixins: [
    componentStoreFactory(referencesListStore),
  ],

  props: {
    projectId: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapState({
      referencesList(state, getters) { return getters[`${this.storeNS}/referencesList`]; }
    })
  },

  created() {
    this.updateData();
  },

  methods: {
    updateData() {
      this.$setReady(false);

      return Promise.all([
        this.$store.dispatch(`${this.storeNS}/getReferences`)
      ])
        .then(() => {
          this.$setReady(true);
          this.$emit('ready', this.referencesList);
        });
    }
  }
};
