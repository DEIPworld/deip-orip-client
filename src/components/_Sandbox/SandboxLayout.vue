<template>
  <div>
    {{layout}}
  </div>
</template>

<script>
  export default {
    name: 'SandboxLayout',
    data() {
      return {
        layout: {
          nodes: {
            main: {
              is: 'div',
              props: {
                class: 'a b s d'
              },
              on: {
                click() {}
              }
            },
            sidebar: {
              is: 'div',
              nodes: {
                someWidget: {
                  is: 'd-block',
                  props: {
                    title: 'ECI Widget',
                    widget: true
                  },
                  nodes: {
                    eci: {
                      is: 'eci-stats',
                      props: {}
                    }
                  }
                }
              }
            }
          }
        },
        arrayLayout: [
          {
            is: 'layout-section',
            nodes: [
              ...blocks
            ]
          },
          {
            is: 'layout-sidebar',
            nodes: [
              ...widgets
            ]
          }
        ]
      };
    }
  };
</script>

<style scoped>

</style>
