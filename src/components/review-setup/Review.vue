<template>
  <base-page-layout>
    <v-card slot="content" class="full-height full-width pa-5">
      <v-layout row wrap>
        <v-flex align-center xs12 headline bold>Expertise Contribution Model Setup</v-flex>
        <v-flex
          xs12
          mt-5
          subheading
        >Inorder to make your work efficient and help you receive most accurate feedback Open Research and Innovation Platform gives you the opportunity to change review criteria for different content types. Your reviewers will see the criteria on the review page. By default criteria for every type are: Novelty, Tecechnical quality, Methodology. Allso you can change reward coefficient (which is by default 10%) in order to motivate peer-review process</v-flex>
        <v-flex xs12 sm12 md10 lg6 my-5>
          <v-layout row mb-3>
            <v-flex xs3 text-uppercase grey--text>Content types</v-flex>
            <v-flex xs6 text-uppercase grey--text>review criteria</v-flex>
            <v-flex xs3 text-align-center><span class="max-width-150 text-uppercase grey--text">Reward coefficient</span></v-flex>
          </v-layout>
          <v-layout row font-weight-bold bg-hover-lightblue v-for="(item, i) in content" :key="`${item.contentType}${i}`">
            <v-flex xs3 align-self-center>{{ item.contentType }}</v-flex>
            <v-flex xs6 align-self-center>
              <v-layout row wrap>
                <span
                  class="mr-3 mb-1 criteriaLabel"
                  :class="`criteriaLabel-${getClass(criteria)}`"
                  v-for="(criteria, j) in item.reviewCriteria"
                  :key="`${criteria}${j}${i}`"
                >{{ criteria }}</span>
              <v-icon light>mode_edit</v-icon>
              </v-layout>
            </v-flex>
            <v-flex xs3>
                <v-text-field class="max-width-150 centered-input font-weight-regular mx-auto" hide-details v-model="item.rewardCoefficient"/>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 sm10 md7 lg5 mt-5>
          <div class="title mb-4">Review criteria setup</div>
          <v-layout row mb-3>
            <v-flex xs5 text-uppercase grey--text>criteria</v-flex>
            <v-flex xs4 text-uppercase grey--text>valid values 2-5</v-flex>
            <v-flex xs3 text-align-center><span class="max-width-100 text-align-center text-uppercase grey--text">weight 0.1-1</span></v-flex>
          </v-layout>
          <v-layout shrink row mb-3 bg-hover-lightblue v-for="(item, i) in criteria" :key="`${i}0`">
            <v-flex xs5 align-self-center>
              <span
                class="criteriaLabel"
                :class="`criteriaLabel-${getClass(item.name)}`"
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
                <v-text-field class="pa-0 my-0 mx-auto max-width-100 centered-input" hide-details v-model="item.weight"/>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </base-page-layout>
</template>

<script>
export default {
  name: "Review",

  data() {
    return {
      content: [
        {
          contentType: "Announcement",
          reviewCriteria: ["Technical quality", "methodology", "Novelty"],
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
          reviewCriteria: ["Technical quality", "methodology", "Novelty"],
          rewardCoefficient: 10
        },
        {
          contentType: "Method",
          reviewCriteria: ["Technical quality", "methodology", "Novelty"],
          rewardCoefficient: 7
        },
        {
          contentType: "Patent",
          reviewCriteria: [
            "methodology",
            "originality",
            "Scientific relevance"
          ],
          rewardCoefficient: 1
        },
        {
          contentType: "Raw data",
          reviewCriteria: ["Technical quality", "methodology", "Novelty"],
          rewardCoefficient: 4
        },
        {
          contentType: "Research proposal",
          reviewCriteria: ["Technical quality", "methodology", "Novelty"],
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
          name: "methodology",
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
          name: "originality",
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
    getClass(name) {
      return name.replace(" ", "").toLowerCase();
    }
  }
};
</script>

<style scoped>
.criteriaLabel {
  padding: 2px 10px;
  border-radius: 100px;
  color: #fff;
}
.bg-hover-lightblue:hover{
  background: #EBF5FE;
}
.criteriaLabel-technicalquality {
  background: #abec95;
}
.criteriaLabel-replication {
  background: #83d288;
}
.criteriaLabel-impact {
  background: #64b286;
}
.criteriaLabel-excellence {
  background: #439583;
}
.criteriaLabel-methodology {
  background: #277681;
}
.criteriaLabel-rationality {
  background: #2b5483;
}
.criteriaLabel-novelty {
  background: #213184;
}
.criteriaLabel-originality {
  background: #000783;
}
.criteriaLabel-scientificrelevance {
  background: #290147;
}
.max-width-150{
  max-width: 150px;
}
.max-width-100{
  max-width: 100px;
}
.centered-input >>> input{
  text-align: center;
}
</style>