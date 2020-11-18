<template>
  <v-responsive
    v-if="videoUrl"
    :aspect-ratio="aspectRatio"
    v-bind="measurableProps"
  >
    <iframe
      class="pos-absolute fill-box"
      style="border: 0"
      allowfullscreen
      :src="videoUrl"
    />
  </v-responsive>
</template>

<script>
  import Measurable from 'vuetify/lib/mixins/measurable';

  const videosMap = [
    {
      // reg: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/i,
      // reg: /^.*(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i,
      reg: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i,
      url: 'https://www.youtube.com/embed/$5',
      params: {
        'picture-in-picture': 1,
        accelerometer: 1,
        gyroscope: 1

      }
    },
    {
      reg: /^.*vimeo.com\/(\d+)($|\/|\b)/i,
      url: 'https://player.vimeo.com/video/$1',
      params: {
        title: 0,
        byline: 0,
        portrait: 0
      }
    },

    {
      reg: /^.*(?:\/video|dai.ly)\/([A-Za-z0-9]+)([^#&?]*).*/i,
      url: 'https://www.dailymotion.com/embed/video/$1',
      params: {
        autoplay: 0
      }
    },

    {
      reg: /^.*coub.com\/(?:embed|view)\/([A-Za-z0-9]+)([^#&?]*).*/i,
      url: 'https://coub.com/embed/$1',
      params: {
        autoplay: 0
      }
    }
  ];

  export default {
    name: 'DVideoEmbed',
    props: {
      aspectRatio: {
        type: Number,
        default: 16 / 9
      },

      ...Measurable.options.props,

      src: {
        type: String,
        required: true,
        default: undefined
      },

      params: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      measurableProps() {
        return Object.keys(Measurable.options.props)
          .reduce((props, key) => ({ ...props, ...(this[key] ? { [key]: this[key] } : {}) }), {});
      },

      videoUrl() {
        const videoObj = videosMap.find((v) => v.reg.test(this.src));

        if (videoObj) {
          const params = { ...videoObj.params, ...this.params };
          const query = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
          const and = videoObj.url.indexOf('?') >= 0 ? '&' : '?';

          return this.src.replace(videoObj.reg, videoObj.url) + and + query;
        }

        throw new Error('No video settings find');
      }
    }
  };
</script>
