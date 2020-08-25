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
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';

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
        fieldKeys: Object.keys(NAMING_MAP),
        domains: [...disciplinesService.getTopLevelNodes().map(((d) => ({ text: d.label, value: d.id })))]
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

            if (key === 'attributes') {
              data = research[key].reduce((acc, attr) => {
                const researchAttribute = this.tenant.profile.settings.researchAttributes.find((c) => c._id === attr.researchAttributeId);
                if (attr.value !== null) {
                  let value = researchAttribute.valueOptions.find(opt => opt.value == attr.value);
                  let valueIdx = researchAttribute.valueOptions.indexOf(value);

                  acc.push({
                    name: researchAttribute.title,
                    value: {
                      ...value,
                      number: valueIdx + 1
                    }
                  });
                }
                return acc;
              }, []);
            }

            if (key === 'researchDisciplines') {
              data = this.domains.find((k) => k.value === research[key][0]).text;
            }

            if (key.includes('Attachment')) {
              const link = `${window.env.DEIP_SERVER_URL}/api/research/application/${research._id}/attachment?filename=${research[key]}&download=false&authorization=${accessService.getAccessToken()}`;
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
