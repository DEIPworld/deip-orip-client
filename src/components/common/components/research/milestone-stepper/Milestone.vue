
<template>

<div :class="{ 'main-step': isMain }" class="research-step">

  <div class="research-step-head">
    <span class="research-step-icon"></span>
    <div class="research-step-line" v-show="!isLast" :style="lineStyle">
      <div v-if="!isReadOnly" class="research-intermediate-step" :style="intermediateStepStyle">
        <span class="research-intermediate-step-icon" @click="insertStep()"></span>
      </div>
    </div>
  </div>

  <div class="research-step-main" :class="{'read-only-main-content': isReadOnly}">
    <div class="research-step-goal" ref="title">
      <div v-if="!isReadOnly">
        <v-layout row wrap justify-space-between align-top>
          <v-flex xl5 lg5 sm5 md12 xs12>
            <v-text-field
              v-model="step.goal" 
              :error-messages="step.validation.goalError"
              @click.native="clearValidation()"
              class="my-0 pa-0 mx-2"
              solo
              label="Milestone Goal"
              prepend-inner-icon="adjust"
            ></v-text-field>
          </v-flex>

          <v-flex xl5 lg5 sm5 md9 xs9>
            <v-menu
              v-model="step.etaMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              full-width
              min-width="300px"
            >
              <template slot="activator">
                <v-text-field
                  v-model="step.eta"
                  :error-messages="step.validation.etaError"
                  @click.native="clearValidation()"
                  class="my-0 pa-0 mx-2"
                  solo
                  label="Deadline"
                  prepend-inner-icon="event"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker v-model="step.eta" @input="step.etaMenu = false" no-title></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xl2 lg2 sm2 md3 xs3 text-xs-right>
            <div class="full-height fill-height">
              <v-btn 
                v-if="!isFirst" 
                :small="$vuetify.breakpoint.smAndDown" 
                color="primary"
                class="my-0 pa-0"
                outline
                fab
                @click="removeStep()">
                <v-icon>remove</v-icon>
              </v-btn>
            </div>
          </v-flex>
          <v-flex xl12 lg12 sm12 md12 xs12>
            <v-textarea
              v-model="step.details"
              class="my-0 pa-0 mx-2"
              solo
              auto-grow
              label="Milestone Description"
              prepend-inner-icon="subject"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </div>

      <div v-else-if="isReadOnly" class="mx-3">
        <v-layout row wrap align-baseline>
          <v-flex xl4 lg4 sm4 md12 xs12>
            <p class="subheading">{{step.goal}}</p>
          </v-flex>
          <v-flex xl8 lg8 sm8 md12 xs12>
            <p class="grey--text">{{moment(step.eta).format('D MMM YYYY')}}</p>
            <p>{{step.details}}</p>
          </v-flex>
        </v-layout>
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
    data () {
      return {
        lineStyle: {},
        intermediateStepStyle: {}
      };
    },
    methods: {
      handleResize() {
        adjust.call(this)
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
    },

    mounted() {
      adjust.call(this)
    }
};

function adjust() {

  let step_el = this.$el;
  let head_el = this.$el.firstElementChild;
  let stepHeight = step_el.getBoundingClientRect().height
  let headHeigth = head_el.getBoundingClientRect().height

  let lineHeight = ((stepHeight - headHeigth) / stepHeight) * 100;
  let lineLeftOffset = head_el.getBoundingClientRect().width / 2;
  this.lineStyle = {
      left: lineLeftOffset + "px",
      height: lineHeight + "%"
  };

  if (!this.isReadOnly) {
      let intermediate_step_el = head_el.lastElementChild.firstElementChild
      let intermediateStepTopOffset = lineHeight / 2
      let intermediateStepLeftOffset = parseInt(window.getComputedStyle(intermediate_step_el).getPropertyValue("width")) / 2
      this.intermediateStepStyle = {
          top: intermediateStepTopOffset + "%",
          left: "-" + intermediateStepLeftOffset + "px"
      }
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