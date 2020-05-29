export const FullScreenMixin = {
  props: {
    title: {
      type: String,
      default: null
    },
    toolbarColor: {
      type: String,
      default: '#fff'
    },
    toolbarOverlap: {
      type: Boolean,
      default: false
    },
    hideToolbar: {
      type: Boolean,
      default: false
    },
    noGutters: {
      type: Boolean,
      default: false
    },

    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String],
  }
}
