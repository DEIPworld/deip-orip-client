<template>
  <v-app>
    <v-main>
      <div class="display-flex full-height pos-relative overflow-hidden">
        <div class="c-m-auto text-align-center">
          <div class="text-h2 bold">
            {{ $t('noAccessPage.sorry') }}
          </div>
          <div class="text-h5">
            {{ $t('noAccessPage.noAccess') }}
          </div>
        </div>

        <img class="left-polygon" src="/assets/img/polygon.svg">
        <img class="right-polygon" src="/assets/img/polygon.svg">
      </div>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'NoAccessPage'
  };
</script>

<style lang="less" scoped>
    .right-polygon {
        transform: rotate(-65deg);
        position: absolute;
        opacity: 0.5;
        top: 90px;

        right: -150px;
    }

    .left-polygon {
        transform: rotate(-65deg);
        position: absolute;
        opacity: 0.5;
        top: 90px;

        left: -200px;
    }
</style>
