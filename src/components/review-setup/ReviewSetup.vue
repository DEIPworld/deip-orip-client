<template>
  <layout-section>
    <v-card flat class="full-height full-width">
      <v-row no-gutters>
        <v-col cols="12" class="text-h5 font-weight-bold">
          Expertise Contribution Model Setup
        </v-col>
        <v-col
          cols="12"
          class="mt-12 text-subtitle-1"
        >
          In order to make your work efficient and help you receive most accurate feedback Open Research and Innovation Platform gives you the opportunity to change review criteria for different content types. Your reviewers will see the criteria on the review page. By default criteria for every type are: Novelty, Tecechnical quality, Methodology. Allso you can change reward coefficient (which is by default 10%) in order to motivate peer-review process
        </v-col>
        <v-col
          cols="auto"
          class="my-12"
        >
          <v-row no-gutters class="mb-4">
            <v-col cols="3" class="text-uppercase grey--text">
              Contribution type
            </v-col>
            <v-col cols="6" class="text-uppercase grey--text pl-4">
              Review criteria
            </v-col>
            <v-col cols="3" class="text-center">
              <span class="max-width-150 text-uppercase grey--text">Reward coefficient</span>
            </v-col>
          </v-row>
          <v-row
            v-for="(item, i) in content"
            :key="`${item.contentType}${i}`"
            no-gutters
            class="font-weight-bold bg-hover-lightblue py-2"
          >
            <v-col cols="3" class="align-self-center">
              {{ item.contentType }}
            </v-col>
            <v-col cols="6" class="align-self-center">
              <!-- <span
                class="mr-4 mb-1 criteriaLabel"
                :class="`criteriaLabel-${getClassName(criteria)}`"
                v-for="(criteria, j) in item.reviewCriteria"
                :key="`${criteria}${j}${i}`"
              >{{ criteria }}</span>
              <v-icon light>mode_edit</v-icon>-->
              <v-select
                v-model="item.reviewCriteria"
                :items="criteria"
                item-text="name"
                item-value="name"
                chips
                append-icon="mode_edit"
                multiple
                class="pa-0 no-underline"
                hide-details
              >
                <template v-slot:selection="{item}">
                  <v-chip :class="`criteriaLabel-${getClassName(item.name)}`">
                    <span class="white--text">{{ item.name }}</span>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            <v-col cols="3" class="align-self-center">
              <v-text-field
                v-model="item.rewardCoefficient"
                outlined
                class="pa-0 my-0 mx-auto max-width-150 centered-input font-weight-regular"
                hide-details
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col
          cols="12"
          sm="10"
          md="7"
          lg="6"
          class="mt-12"
        >
          <div class="text-h6 mb-6">
            Review criteria setup
          </div>
          <v-row no-gutters class="mb-4">
            <v-col cols="5" class="text-uppercase grey--text">
              Criteria
            </v-col>
            <v-col cols="4" class="text-uppercase grey--text">
              Valid values 2-5
            </v-col>
            <v-col cols="3" class="text-center">
              <span class="max-width-100 text-center text-uppercase grey--text">Weight 0.1-1</span>
            </v-col>
          </v-row>
          <v-row
            v-for="(item, i) in criteria"
            :key="`${i}0`"
            no-gutters
            class="mb-2 py-1 bg-hover-lightblue"
          >
            <v-col cols="5" class="align-self-center">
              <span
                class="criteriaLabel white--text py-1 px-2"
                :class="`criteriaLabel-${getClassName(item.name)}`"
              >{{ item.name }}</span>
            </v-col>
            <v-col cols="4" class="align-self-center d-flex">
              <div class="align-self-center">
                <review-assessment-squared-rating
                  v-model="item.value"
                  :readonly="false"
                  :value="item.value"
                />
              </div>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="item.weight"
                outlined
                class="pa-0 my-0 mx-auto max-width-100 centered-input"
                hide-details
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </layout-section>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ReviewSetup',
    components: { LayoutSection },
    data() {
      return {
        content: [
          {
            contentType: 'Announcement',
            reviewCriteria: ['Technical quality', 'Methodology', 'Novelty'],
            rewardCoefficient: 10
          },
          {
            contentType: 'Article',
            reviewCriteria: ['Impact', 'Excellence', 'Novelty'],
            rewardCoefficient: 5
          },
          {
            contentType: 'Data',
            reviewCriteria: ['Technical quality', 'Replication', 'Rationality'],
            rewardCoefficient: 3
          },
          {
            contentType: 'Experiment findings',
            reviewCriteria: ['Technical quality', 'Methodology', 'Novelty'],
            rewardCoefficient: 10
          },
          {
            contentType: 'Method',
            reviewCriteria: ['Technical quality', 'Methodology', 'Novelty'],
            rewardCoefficient: 7
          },
          {
            contentType: 'Patent',
            reviewCriteria: [
              'Methodology',
              'Originality',
              'Scientific relevance'
            ],
            rewardCoefficient: 1
          },
          {
            contentType: 'Raw data',
            reviewCriteria: ['Technical quality', 'Methodology', 'Novelty'],
            rewardCoefficient: 4
          },
          {
            contentType: 'Project proposal',
            reviewCriteria: ['Technical quality', 'Methodology', 'Novelty'],
            rewardCoefficient: 7
          }
        ],
        criteria: [
          {
            name: 'Technical quality',
            value: 3,
            weight: 1
          },
          {
            name: 'Replication',
            value: 3,
            weight: 0.1
          },
          {
            name: 'Impact',
            value: 4,
            weight: 0.3
          },
          {
            name: 'Excellence',
            value: 4,
            weight: 0.5
          },
          {
            name: 'Methodology',
            value: 5,
            weight: 1
          },
          {
            name: 'Rationality',
            value: 2,
            weight: 0.2
          },
          {
            name: 'Novelty',
            value: 4,
            weight: 0.7
          },
          {
            name: 'Originality',
            value: 4,
            weight: 0.6
          },
          {
            name: 'Scientific relevance',
            value: 5,
            weight: 0.5
          }
        ]
      };
    },
    methods: {
      getClassName(name) {
        return name.replace(' ', '').toLowerCase();
      }
    }
  };
</script>

<style scoped lang="less">
@criteriaLabel-colors: technicalquality #abec95, replication #83d288,
  impact #64b286, excellence #439583, methodology #277681, rationality #2b5483,
  novelty #213184, originality #000783, scientificrelevance #290147;

.make-classes(@prefix, @list) {
  .iter(length(@list));
  .iter(@i) when (@i > 0) {
    .iter(@i - 1);
    @pair: extract(@list, @i);
    @key: extract(@pair, 1);
    @value: extract(@pair, 2);
    .@{prefix}-@{key} {
      background: @value !important;
    }
  }
}

.max-width(@value, @unit) {
  .max-width-@{value} {
    max-width: unit(@value, @unit);
  }
}
.make-classes(criteriaLabel, @criteriaLabel-colors);
.max-width(150, px);
.max-width(100, px);

.criteriaLabel {
  border-radius: 100px;
}

.bg-hover-lightblue {
  &:hover {
    background: #ebf5fe;
  }
}

.centered-input/deep/input {
  text-align: center;
}
.no-underline.v-text-field/deep/.v-input__control {
  .v-input__slot {
    &:before {
      border-style: none;
    }
    &:after {
      border-style: none;
    }
  }
}
</style>
