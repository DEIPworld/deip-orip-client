export default {
  type: 'body',
  tagName: 'body',

  import(el, node, converter) {
    node.id = 'body';
    node.nodes = el.getChildren().map((child) => {
      const childNode = converter.convertElement(child);
      return childNode.id;
    });
  },

  export(node, el, converter) {
    const self = this;
    const doc = node.getDocument();

    function sanitize(parent) {
      parent.removeAttribute('data-id');
      parent.children.forEach((child) => {
        sanitize(child);
      });
      // return parent;
    }

    const children = node.nodes.map((id) => {
      const child = doc.get(id);
      const childEl = converter.convertNode(child);
      // we don't want to affect original el
      const cl = childEl.clone();
      sanitize(cl);
      return cl;
    });

    const images = children.filter((child) => child.tagName === 'img');
    const rest = children.filter((child) => child.tagName !== 'img');

    const promises = [...rest.map((el) => Promise.resolve(el)), ...images.map((img) => {
      const src = img.getAttribute('src');
      return self.fetchAsBlob(src)
        .then(self.convertBlobToBase64)
        .then((base64) => {
          img.setAttribute('src', base64);
          return img;
        });
    })];

    return Promise.all(promises)
      .then((elements) => {
        const bodyHtml = elements.map((el) => el.outerHTML).join('');
        return `<html><head></head><body>${bodyHtml}</body></html>`;
      });
  },

  fetchAsBlob: (url) => fetch(url)
    .then((response) => response.blob()),

  convertBlobToBase64: (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })
};
