<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, markRaw } from 'vue';
import * as echarts from 'echarts';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  option: {
    type: Object,
    required: true,
    default: () => ({})
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  },
  theme: {
    type: [String, Object],
    default: null
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);

const initChart = () => {
  if (!chartRef.value) return;
  // Dispose existing instance if any
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  
  chartInstance.value = markRaw(echarts.init(chartRef.value, props.theme));
  chartInstance.value.setOption(props.option);
};

const resizeHandler = useDebounceFn(() => {
  chartInstance.value?.resize();
}, 100);

watch(
  () => props.option,
  (newOption) => {
    chartInstance.value?.setOption(newOption);
  },
  { deep: true }
);

watch(
  () => props.theme,
  () => {
    initChart();
  }
);

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  chartInstance.value?.dispose();
});

defineExpose({
  chartInstance
});
</script>
