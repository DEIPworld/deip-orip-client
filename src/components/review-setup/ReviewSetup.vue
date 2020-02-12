<template>
  <base-page-layout>
    <v-card slot="content" class="full-height full-width pa-5">
      <v-layout row wrap>
        <v-flex align-center xs12 headline bold>Expertise Contribution Model Setup</v-flex>
        <v-flex
          xs12
          mt-5
          subheading
        >In order to make your work efficient and help you receive most accurate feedback Open Research and Innovation Platform gives you the opportunity to change review criteria for different content types. Your reviewers will see the criteria on the review page. By default criteria for every type are: Novelty, Tecechnical quality, Methodology. Allso you can change reward coefficient (which is by default 10%) in order to motivate peer-review process</v-flex>
        <v-flex xs12 sm12 md10 lg7 my-5>
          <v-layout row mb-3>
            <v-flex xs2 text-uppercase grey--text>Contribution type</v-flex>
            <v-flex xs6 text-uppercase grey--text>Review criteria</v-flex>
            <v-flex xs3 text-align-center>
              <span class="max-width-150 text-uppercase grey--text">Reward coefficient</span>
            </v-flex>
          </v-layout>
          <v-layout
            row
            font-weight-bold
            bg-hover-lightblue
            py-2
            v-for="(item, i) in content"
            :key="`${item.contentType}${i}`"
          >
            <v-flex xs2 align-self-center>{{ item.contentType }}</v-flex>
            <v-flex xs6 align-self-center>
              <v-layout row wrap>
                <!-- <span
                  class="mr-3 mb-1 criteriaLabel"
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
              </v-layout>
            </v-flex>
            <v-flex xs3 align-self-center>
              <v-text-field
                class="pa-0 my-0 mx-auto max-width-150 centered-input font-weight-regular"
                hide-details
                v-model="item.rewardCoefficient"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 sm10 md7 lg5 mt-5>
          <div class="title mb-4">Review criteria setup</div>
          <v-layout row mb-3>
            <v-flex xs5 text-uppercase grey--text>Criteria</v-flex>
            <v-flex xs4 text-uppercase grey--text>Valid values 2-5</v-flex>
            <v-flex xs3 text-align-center>
              <span class="max-width-100 text-align-center text-uppercase grey--text">Weight 0.1-1</span>
            </v-flex>
          </v-layout>
          <v-layout row mb-2 py-1 bg-hover-lightblue v-for="(item, i) in criteria" :key="`${i}0`">
            <v-flex xs5 align-self-center>
              <span
                class="criteriaLabel white--text py-1 px-2"
                :class="`criteriaLabel-${getClassName(item.name)}`"
              >{{ item.name }}</span>
            </v-flex>
            <v-flex xs4 align-self-center>
              <v-layout row>
                <v-flex xs1>{{ item.value }}</v-flex>
                <v-flex xs11 align-self-center>
                  <review-assessment-squared-rating
                    v-model="item.value"
                    :readonly="false"
                    :value="item.value"
                  ></review-assessment-squared-rating>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                class="pa-0 my-0 mx-auto max-width-100 centered-input"
                hide-details
                v-model="item.weight"
              />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
export default {
  name: "ReviewSetup",

  data() {
    return {
      content: [
        {
          contentType: "Announcement",
          reviewCriteria: ["Technical quality", "Methodology", "Novelty"],
          rewardCoefficient: 10
        },
        {
          contentType: "Article",
          reviewCriteria: ["Impact", "Excellence", "Novelty"],
          rewardCoefficient: 5
        },
        {
          contentType: "Data",
          reviewCriteria: ["Technical quality", "Replication", "Rationality"],
          rewardCoefficient: 3
        },
        {
          contentType: "Experiment findings",
          reviewCriteria: ["Technical quality", "Methodology", "Novelty"],
          rewardCoefficient: 10
        },
        {
          contentType: "Method",
          reviewCriteria: ["Technical quality", "Methodology", "Novelty"],
          rewardCoefficient: 7
        },
        {
          contentType: "Patent",
          reviewCriteria: [
            "Methodology",
            "Originality",
            "Scientific relevance"
          ],
          rewardCoefficient: 1
        },
        {
          contentType: "Raw data",
          reviewCriteria: ["Technical quality", "Methodology", "Novelty"],
          rewardCoefficient: 4
        },
        {
          contentType: "Research proposal",
          reviewCriteria: ["Technical quality", "Methodology", "Novelty"],
          rewardCoefficient: 7
        }
      ],
      criteria: [
        {
          name: "Technical quality",
          value: 3,
          weight: 1
        },
        {
          name: "Replication",
          value: 3,
          weight: 0.1
        },
        {
          name: "Impact",
          value: 4,
          weight: 0.3
        },
        {
          name: "Excellence",
          value: 4,
          weight: 0.5
        },
        {
          name: "Methodology",
          value: 5,
          weight: 1
        },
        {
          name: "Rationality",
          value: 2,
          weight: 0.2
        },
        {
          name: "Novelty",
          value: 4,
          weight: 0.7
        },
        {
          name: "Originality",
          value: 4,
          weight: 0.6
        },
        {
          name: "Scientific relevance",
          value: 5,
          weight: 0.5
        }
      ]
    };
  },
  methods: {
    getClassName(name) {
      return name.replace(" ", "").toLowerCase();
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