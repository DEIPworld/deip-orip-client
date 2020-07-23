
<template>
  <div :class="{ 'main-step': isMain }" class="research-step">
    <div class="research-step-head">
      <span class="research-step-icon" />
      <div v-show="!isLast" class="research-step-line" :style="lineStyle">
        <div v-if="!isReadOnly" class="research-intermediate-step" :style="intermediateStepStyle">
          <span class="research-intermediate-step-icon" @click="insertStep()" />
        </div>
      </div>
    </div>

    <div class="research-step-main" :class="{'read-only-main-content': isReadOnly}">
      <div ref="title" class="research-step-goal">
        <div v-if="!isReadOnly">
          <v-row
            class="align-top"
            justify="space-between"
          >
            <v-col
              xl="5"
              lg="5"
              sm="5"
              md="12"
              cols="12"
            >
              <v-text-field
                v-model="step.goal"
                :error-messages="step.validation.goalError"
                class="my-0 pa-0 mx-2"
                outlined dense
                label="Milestone Goal"
                prepend-inner-icon="adjust"
                @click.native="clearValidation()"
              />
            </v-col>

            <v-col
              xl="5"
              lg="5"
              sm="5"
              md="9"
              cols="9"
            >
              <v-menu
                v-model="step.etaMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                min-width="300px"
              >
                <template v-slot:activator="{on}">
                  <v-text-field
                    v-model="step.eta"
                    :error-messages="step.validation.etaError"
                    class="my-0 pa-0 mx-2"
                    outlined dense
                    label="Deadline"
                    prepend-inner-icon="event"
                    readonly
                    @click.native="clearValidation()"
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="step.eta" no-title @input="step.etaMenu = false" />
              </v-menu>
            </v-col>
            <v-col
              class="text--right"
              xl="2"
              lg="2"
              sm="2"
              md="3"
              cols="3"
            >
              <div class="full-height fill-height">
                <v-btn
                  v-if="!isFirst"
                  :small="$vuetify.breakpoint.smAndDown"
                  color="primary"
                  class="my-0 pa-0"
                  outlined
                  fab
                  @click="removeStep()"
                >
                  <v-icon>remove</v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col
              xl="5"
              lg="5"
              sm="5"
              md="12"
              cols="12"
            >
              <v-text-field
                v-model="step.budget"
                :error-messages="step.validation.budgetError"
                class="my-0 pa-0 mx-2"
                outlined dense
                label="Estimated budget"
                prepend-inner-icon="mdi-currency-usd"
                @click.native="clearValidation()"
              />
            </v-col>


            <v-col
              xl="7"
              lg="7"
              sm="7"
              md="12"
              cols="12"
            >
              <v-text-field
                v-model="step.purpose"
                :error-messages="step.validation.purposeError"
                class="my-0 pa-0 mx-2"
                outlined dense
                label="Budget purpose"
                @click.native="clearValidation()"
              />
            </v-col>


            <v-col
              xl="12"
              lg="12"
              sm="12"
              md="12"
              cols="12"
            >
              <v-textarea
                v-model="step.details"
                class="my-0 pa-0 mx-2"
                outlined dense
                auto-grow
                label="Milestone Description"
                prepend-inner-icon="subject"
              />
            </v-col>
          </v-row>
        </div>

        <div v-else-if="isReadOnly" class="mx-4">
          <v-row align="center">
            <v-col
              xl="4"
              lg="4"
              sm="4"
              md="12"
              cols="12"
            >
              <p class="text-subtitle-1">
                {{ step.goal }}
              </p>
            </v-col>
            <v-col
              xl="8"
              lg="8"
              sm="8"
              md="12"
              cols="12"
            >
              <p class="grey--text">
                {{ moment(step.eta).format('D MMM YYYY') }}
              </p>
              <p>{{ step.details }}</p>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <resize-observer @notify="handleResize" />
  </div>
</template>


<script>

  export default {
    name: 'Milestone',
    props: {
      step: Object,
      isMain: Boolean,
      isFirst: Boolean,
      isLast: Boolean,
      isReadOnly: Boolean
    },
    data() {
      return {
        lineStyle: {},
        intermediateStepStyle: {}
      };
    },

    mounted() {
      adjust.call(this);
    },
    methods: {
      handleResize() {
        adjust.call(this);
      },
      insertStep() {
        this.$emit('insertStep');
      },
      removeStep() {
        this.$emit('removeStep');
      },
      clearValidation() {
        this.$emit('clearValidation');
      }
    }
  };

  function adjust() {
    const step_el = this.$el;
    const head_el = this.$el.firstElementChild;
    const stepHeight = step_el.getBoundingClientRect().height;
    const headHeigth = head_el.getBoundingClientRect().height;

    const lineHeight = ((stepHeight - headHeigth) / stepHeight) * 100;
    const lineLeftOffset = head_el.getBoundingClientRect().width / 2;
    this.lineStyle = {
      left: `${lineLeftOffset}px`,
      height: `${lineHeight}%`
    };

    if (!this.isReadOnly) {
      const intermediate_step_el = head_el.lastElementChild.firstElementChild;
      const intermediateStepTopOffset = lineHeight / 2;
      const intermediateStepLeftOffset = parseInt(window.getComputedStyle(intermediate_step_el).getPropertyValue('width')) / 2;
      this.intermediateStepStyle = {
        top: `${intermediateStepTopOffset}%`,
        left: `-${intermediateStepLeftOffset}px`
      };
    }
  }


</script>


<style>

 .research-step {
    position: relative;
    display: inline-block;
    width: 100%
  }

 .research-step-head {
    width: 20%;
    float: left;
    clear: right;
    text-align: center;
 }

 .research-step-goal {
    margin-bottom: 10px;
 }

 .research-step-main {
    width: 80%;
    float: right;
    clear: right;
 }

  .research-step-main.read-only-main-content {
    text-align: left;
  }

 .research-intermediate-step {
    position: absolute;
    width: 28px;
  }

 .research-step-line {
    position: absolute;
    border-color: inherit;
    width: 2px;
    background-color: #bfcbd9;
}

.research-step-icon {
   -moz-border-radius: 55px/55px;
   -webkit-border-radius: 55px 55px;
   border-radius: 55px/55px;
   border: solid 2.5px #bfcbd9;
   background: #ffffff;
   width: 55px;
   height: 55px;
   display: inline-block
}

.main-step .research-step-head .research-step-icon {
    box-shadow: 0px 0px 10px gold;
}

.research-intermediate-step-icon {
   -moz-border-radius: 25px/25px;
   -webkit-border-radius: 25px 25px;
   border-radius: 25px/25px;
   border: dotted 2.5px #bfcbd9;
   background: #ffffff;
   width: 25px;
   height: 25px;
   display: inline-block;
   cursor: pointer;
}

.research-intermediate-step-icon:hover {
   border: dotted 2.5px #2962ff;
}
</style>
