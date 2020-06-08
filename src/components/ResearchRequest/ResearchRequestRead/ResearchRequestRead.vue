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
                { text: 'Bio Products', value: '56dba1440c40847fb1fedbee3cfef524081ee313' },
                { text: 'Bio Energy', value: '1f5dc208490c6f4a8ec86b9dc12c4c1a9a8c420a' },
                { text: 'Bio Food', value: 'f3d0968f8d47ffbca23352abcb90aadb345a55d1' },
                { text: 'Bio Chemical', value: 'b8ea1adb762f41fe10f193c58bca836b94fb0021' },
                { text: 'Bio Fiber', value: 'c4545e9398409ec03c6c2eae25c685ad323f2e60' },
                { text: 'Bio Mechanical', value: '369a26e132a69db02a613a59fc33127f6652dd1d' }
              ].find((k) => k.value === research[key][0]).text;
            }

            if (key.includes('Attachment')) {
              const link = `${window.env.DEIP_SERVER_URL}/api/research/application/${research._id}/attachment?filename=${research[key]}&download=false&authorization=${accessService.getAccessToken()}`
              data = `${research[key] ? `<a href="${link}" target="_blank">${research[key]}</a>` : '-'}`;
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
