import { fileNameFromUrl } from '@/utils/helpers';

export const filesChore = {
  data() {
    return {
      iconsMap: [
        { icon: 'mdi-file-image-outline', ext: ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif'] },
        { icon: 'mdi-file-document-outline', ext: [] },
        { icon: 'mdi-file-excel-outline', ext: [] },
        { icon: 'mdi-file-table-outline', ext: [] },
        { icon: 'mdi-file-pdf-outline', ext: [] },
        { icon: 'mdi-file-powerpoint-outline', ext: [] }
      ]
    };
  },
  methods: {
    fileIcon(name) {
      if (!name) return false;

      const target = this.iconsMap
        .find((item) => item.ext.includes(name.split('.').pop()));

      if (!target) return 'mdi-file-outline';

      return target.icon;
    },
    fileNameFromUrl(url) {
      return fileNameFromUrl(url);
    }
  }
};
