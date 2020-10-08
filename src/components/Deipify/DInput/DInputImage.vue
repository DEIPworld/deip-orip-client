<template>
  <div>
    <div class="text-body-2 mb-1 text--secondary" v-if="label">
      {{ label }}
    </div>
    <v-sheet rounded class="overflow-hidden">
      <v-responsive
        :aspect-ratio="aspectRatio"
      >
        <croppa
          v-model="croppa"
          :accept="'image/*'"
          :prevent-white-space="true"
          :show-remove-button="false"
          :disable-scroll-to-zoom="true"

          placeholder="Choose or drag-n-drop an image"
          :placeholder-font-size="14"
          placeholder-color="rgba(0,0,0,.5)"
          canvas-color="#F5F5F5"

          initial-size="cover"
          initial-position="center"
          auto-sizing
          :style="{width: '100%', height: '100%', display: 'block'}"
          :initial-image="initialImage"

          @init="onInit"

          @new-image-drawn="onNewImage"
          @draw="onDrawDebounce"
          @file-choose="onFileChoose"
          @initial-image-loaded="onInitialImageLoaded"
        />
        <!--@draw="debounceInternalValue"-->
      </v-responsive>

      <template v-if="isInited">
        <v-divider />

        <v-sheet color="grey lighten-4 pa-2 d-flex align-center">

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(1)">
            <v-icon>rotate_right</v-icon>
          </v-btn>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(-1)">
            <v-icon>rotate_left</v-icon>
          </v-btn>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipX()">
            <v-icon>flip</v-icon>
          </v-btn>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipY()">
            <v-icon>mdi-flip-vertical</v-icon>
          </v-btn>

          <div class="spacer mx-4">
            <v-slider
              v-model="sliderVal"
              class="flex-grow-0 flex-shrink-0"
              :min="sliderMin"
              :max="sliderMax"
              :step="0.001"
              :hide-details="true"
              :disabled="!croppa.hasImage()"
              @input="onSliderInput"
            />
          </div>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.chooseFile()">
            <v-icon>loop</v-icon>
          </v-btn>

          <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.remove()">
            <v-icon>clear</v-icon>
          </v-btn>

        </v-sheet>
      </template>
    </v-sheet>

  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import Croppa from 'vue-croppa/src/cropper';
  import { debounce } from 'vuetify/lib/util/helpers';
  import { fileNameFromUrl } from '@/utils/helpers';
  import 'vue-croppa/dist/vue-croppa.css';

  export default {
    name: 'DInputImage',

    components: {
      Croppa
    },

    mixins: [Proxyable],

    props: {
      initialImage: {
        type: String,
        default: null
      },
      aspectRatio: {
        type: Number,
        default: 16 / 9
      },
      label: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        croppa: {},

        isInited: false,

        sliderVal: 0,
        sliderMin: 0,
        sliderMax: 0,

        onDrawDebounce: null,
        chosedFile: null
      };
    },

    created() {
      this.onDrawDebounce = debounce(this.onDraw, 500);
    },

    methods: {
      onInit() {
        this.isInited = true;
      },

      onNewImage() {
        this.sliderVal = this.croppa.scaleRatio;
        this.sliderMin = this.croppa.scaleRatio;
        this.sliderMax = this.croppa.scaleRatio * 4;
      },

      onFileChoose(file) {
        this.chosedFile = file;
      },

      onInitialImageLoaded() {
        if (!this.chosedFile) {
          this.chosedFile = {
            name: fileNameFromUrl(this.initialImage)
          };
        }
      },

      onDraw() {
        // console.log(this.croppa.outputWidth)
        // console.log(this.croppa.naturalWidth)
        this.getBlob()
          .then((blob) => {
            this.internalValue = new File([blob], this.chosedFile.name);
          });
      },

      onSliderInput(e) {
        this.croppa.scaleRatio = +e;
      },

      getDataUrl(mimeType = 'image/png', compressionRate = 1) {
        return this.croppa.generateDataUrl(mimeType, compressionRate);
      },

      getBlob(mimeType = 'image/png', compressionRate = 1) {
        return this.croppa.promisedBlob(mimeType, compressionRate);
      }
    }
  };
</script>
