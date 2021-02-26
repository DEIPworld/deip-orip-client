<template>
  <div>
    <div v-if="label" class="text-body-2 mb-1 text--secondary">
      {{ label }}
    </div>
    <v-sheet rounded class="overflow-hidden">
      <v-responsive
        :aspect-ratio="aspectRatio"
      >

        <template v-if="$hasSlot('mask') && isInited && croppa.hasImage()">
          <v-sheet class="d-mage-input__mask" color="transparent">
            <slot name="mask"></slot>
          </v-sheet>
        </template>

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

          <template v-if="!noRotate">
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(1)">
              <v-icon>rotate_right</v-icon>
            </v-btn>
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.rotate(-1)">
              <v-icon>rotate_left</v-icon>
            </v-btn>
          </template>

          <template v-if="!noFlip">
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipX()">
              <v-icon>flip</v-icon>
            </v-btn>
            <v-btn icon :disabled="!croppa.hasImage()" @click="croppa.flipY()">
              <v-icon>mdi-flip-vertical</v-icon>
            </v-btn>
          </template>


          <div class="spacer mx-4">
            <v-slider
              v-model="sliderVal"
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
  import mime from 'mime';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  // import parsePath from 'parse-path';

  // const imageNameFromUrl = (url) => {
  //   const { pathname } = parsePath(url);
  //   const arr = pathname.split('/');
  // }

  export default {
    name: 'DInputImage',

    components: {
      DSimpleTooltip,
      Croppa
    },

    mixins: [Proxyable],

    props: {
      initialImage: {
        type: String,
        default: null
      },
      initialImageName: {
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
      },

      noFlip: {
        type: Boolean,
        default: false
      },

      noRotate: {
        type: Boolean,
        default: false
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
            name: this.initialImageName || fileNameFromUrl(this.initialImage)
          };
        }
      },

      onDraw() {
        this.getBlob()
          .then((blob) => {
            this.internalValue = new File([blob], this.chosedFile.name);
          });
      },

      onSliderInput(e) {
        this.croppa.scaleRatio = +e;
      },

      getMime(mimeType) {
        if (mimeType) {
          return mimeType;
        }

        if (!mimeType && this.chosedFile.name) {
          return mime.getType(this.chosedFile.name);
        }

        return 'image/png';
      },

      getDataUrl(mimeType, compressionRate = 0.9) {
        return this.croppa.generateDataUrl(
          this.getMime(mimeType),
          compressionRate
        );
      },

      getBlob(mimeType, compressionRate = 0.9) {
        return this.croppa.promisedBlob(
          this.getMime(mimeType),
          compressionRate
        );
      }
    }
  };
</script>

<style lang="scss">
  .d-mage-input {
    &__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 1;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
