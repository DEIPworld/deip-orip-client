export const CustomDirective = {
  bind(el, binding, vnode) {
    const map = {
      input: 'text-field'
    };

    // eslint-disable-next-line no-nested-ternary
    const prefix = binding.arg
      ? map[binding.arg]
        ? map[binding.arg]
        : binding.arg
      : vnode.componentOptions.tag;

    el.classList.add(`${prefix}--${binding.value || 'custom'}`);
  }
}
