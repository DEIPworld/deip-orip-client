
<template>

<div :class="{ 'main-step': isMain }" class="research-step">

  <div class="research-step-head">
    <span class="research-step-icon"></span>
    <div class="research-step-line" v-show="!isLast" :style="lineStyle">
      <div v-if="!isReadOnly" class="research-intermediate-step" :style="intermediateStepStyle">
        <span class="research-intermediate-step-icon" @click="$emit('insert-step')"></span>
      </div>
    </div>
  </div>

  <div class="research-step-main" :class="{'read-only-main-content': isReadOnly}">
    <div class="research-step-target" ref="title">
      <div v-if="!isReadOnly">
        <v-layout row wrap justify-space-between align-baseline>
          <v-flex xl5 lg5 sm5 md12 xs12>
            <v-text-field
              class="my-0 pa-0 mx-2"
              :required="true" 
              v-model="step.target" 
              @focus.native="$emit('remove-validation')"
              solo
              label="Milestone Goal"
              prepend-inner-icon="adjust"
            ></v-text-field>
            <span v-if="step.validation && !step.validation.isValid && step.validation.target" class="md-error">{{step.validation.target}}</span>
          </v-flex>

          <v-flex xl5 lg5 sm5 md10 xs10>
            <v-menu
              v-model="step.etaMenu"
              transition="scale-transition"
              full-width
              min-width="300px"
            >
              <template slot="activator">
                <v-text-field
                  v-model="step.eta"
                  class="mx-2"
                  solo
                  label="Start Date"
                  prepend-inner-icon="event"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker v-model="step.eta" @input="step.etaMenu = false" type="month"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xl2 lg2 sm2 md2 xs2 text-xs-right>
            <v-btn 
              v-if="!isMain" 
              :small="$vuetify.breakpoint.smAndDown" 
              class="mr-2" 
              color="primary"
              outline
              fab 
              @click="$emit('remove-step')">
              <v-icon>remove</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xl12 lg12 sm12 md12 xs12>
            <v-textarea
              v-model="step.details"
              class="my-0 pa-0 mx-2"
              solo
              label="Milestone Description"
              prepend-inner-icon="subject"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </div>

      <div v-else-if="isReadOnly">
        <v-layout row>
          <v-flex xs6>
            <div style="width: 100%; margin-top: 15px">
              <span class="subheading">{{step.target}}</span>
            </div>
          </v-flex>
          <v-flex xs6>
            <div>
              <p style="width: 100%; text-indent: 2em; text-align: justify;">{{step.details}}</p>
              <p style="width: 100%; text-align: right">{{step.eta}}</p>
            </div>
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

 .research-step-target {
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
    width: 28px
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

</style>