<script>
  // WIP !!!
  import ProjectCreate from '@/features/Projects/components/Create/ProjectCreate';
  import { mapGetters } from 'vuex';
  import { expandResearchAttributes } from '@/utils/helpers';

  export default {
    name: 'ProjectEdit',
    mixins: [ProjectCreate],

    computed: {
      ...mapGetters({
        project: 'Project/data'
      })
    },

    created() {

    },

    methods: {
      init() {
        this.expandProjectModel();
      },

      expandProjectModel() {
        const clone = _.cloneDeep(this.project);
        const transformed = {
          ...clone,
          ...{
            researchRef: {
              attributes: expandResearchAttributes(clone.researchRef.attributes)
            }
          }
        };

        this.formModel = { ..._.cloneDeep(transformed) };

        this.$setReady();
      }
    }
  };
</script>
