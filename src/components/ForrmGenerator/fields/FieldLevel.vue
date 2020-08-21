<template>
  <!--  <div>{{field}}</div>-->
  <leveller-selector
    :id="field.name"
    v-model.trim="localValue"
    :label="field.label"
    :name="field.name"
    v-bind="field.props"

    @blur="onBlur"
    @change="onChange"
    @focus="onFocus"
    @input="onInput"
  />
</template>

<script>
  import abstractField from '@/components/ForrmGenerator/fields/abstractField';
  import LevellerSelector from '@/components/Leveller/LevellerSelector';

  export default {
    name: 'FieldLevel',
    components: { LevellerSelector },
    mixins: [abstractField]
  };
</script>

<style scoped>

</style>
