<template>
  <v-skeleton-loader>
    <research-request-read-view
      :key="researchId"
      :research="research"
    />
  </v-skeleton-loader>
</template>

<script>
  import objectRenameKeys from 'object-rename-keys';
  import ResearchRequestReadView from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestReadView';
  import { NAMING_MAP } from '@/components/ResearchRequest/maps';
  import { mapGetters } from 'vuex';
  import { AccessService } from '@deip/access-service';

  const accessService = AccessService.getInstance();

  export default {
    name: 'ResearchRequestFormRead',
    components: {
      ResearchRequestReadView
    },
    props: {
      researchId: {
        type: String,
        default: null
      },
      getFrom: {
        type: String,
        default: null
      }
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant'
      })
    },

    data() {
      return {
        oldResearchId: null,
        research: null,
        fieldKeys: Object.keys(NAMING_MAP)
      };
    },

    created() {
      this.getResearch();
    },

    methods: {
      getResearch() {
        if (this.researchId && this.researchId !== this.oldResearchId) {
          this.oldResearchId = this.researchId;

          let research = this.$store.getters[this.getFrom].filter((k) => k._id === this.researchId)[0];
          const result = [];

          research = objectRenameKeys(research, {
            title: 'researchTitle',
            disciplines: 'researchDisciplines'
          });


          this.research = this.fieldKeys.map((key) => {
            let data = research[key];

            if (key === 'location') {
              data = Object.values(research[key]).filter((k) => k !== null).join(', ');
            }

            if (key === 'tenantCriterias') {
              data = research[key].reduce((a, criteria) => {
                const crit = this.tenant.profile.settings.researchComponents.find((c) => c._id === criteria.component);
                if (criteria.value.index !== null) {
                  a.push({
                    name: crit.component.readinessLevelTitle,
                    value: {
                      ...crit.component.readinessLevels[criteria.value.index],
                      index: criteria.value.index + 1
                    }
                  });
                }
                return a;
              }, []);
            }

            if (key === 'researchDisciplines') {
              data = [
                { text: 'Bio Products', value: '1' },
                { text: 'Bio Energy', value: '2' },
                { text: 'Bio Food', value: '3' },
                { text: 'Bio Chemical', value: '4' },
                { text: 'Bio Fiber', value: '5' },
                { text: 'Bio Mechanical', value: '6' }
              ].find((k) => k.value === research[key][0]).text;
            }

            if (key.includes('Attachment')) {
              const link = `${window.env.DEIP_SERVER_URL}/api/research/application/${research._id}/attachment?filename=${research[key]}&download=false&authorization=${accessService.getAccessToken()}`
              data = `<a href="${link}">${research[key]}</a>`;
            }

            return {
              name: NAMING_MAP[key],
              data
            };
          });
        }
      }
    }
  };
</script>
