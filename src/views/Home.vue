<template>
  <div class="home-container">
    <n-grid :x-gap="12" :y-gap="12" :cols="1" responsive="screen" item-responsive>
      
 

      <!-- Technology Stack Introduction -->
      <n-grid-item>
        <n-card title="项目简介" :bordered="false">
          <div class="mb-4 text-gray-500">
            这是一个基于 Vue 3 + Vite + Naive UI 的中后台管理系统模板。它集成了现代前端开发的最佳实践，旨在提供一个轻量、快速、可扩展的开发基础。
          </div>
          
          <n-divider title-placement="left">技术栈</n-divider>
          
          <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4" responsive="screen">
            <n-grid-item v-for="item in techStack" :key="item.name">
              <n-card size="small" hoverable class="cursor-pointer h-full">
                <template #header>
                  <div class="flex items-center gap-2">
                    <!-- <div :class="item.icon" class="text-2xl"></div> -->
                    <n-avatar v-if="typeof item.icon === 'string' && item.icon.startsWith('i-')" :class="item.icon" size="24px"  />
                    <n-avatar v-else :src="item.icon" size="24px" class="h-24px bg-transparent" />
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <div class="text-gray-500 text-sm">
                  {{ item.description }}
                </div>
              </n-card>
            </n-grid-item>
          </n-grid>

          <n-divider title-placement="left">主要特性</n-divider>
          
          <n-space>
            <n-tag type="success">响应式布局</n-tag>
            <n-tag type="info">暗黑模式</n-tag>
            <n-tag type="warning">动态路由</n-tag>
            <n-tag type="error">权限管理</n-tag>
            <n-tag type="primary">Mock 数据</n-tag>
            <n-tag type="success">Pinia 状态管理</n-tag>
            <n-tag type="info">UnoCSS 原子化 CSS</n-tag>
            <n-tag type="warning">ECharts 图表</n-tag>
            <n-tag type="error">ProTable 通用表格</n-tag>
          </n-space>
        </n-card>
      </n-grid-item>
           <!-- Access Volume Chart -->
      <n-grid-item>
        <n-card title="访问量趋势" :bordered="false">
          <ECharts :option="lineChartOption" height="350px" />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ECharts from '@/components/ECharts/index.vue';
import * as echarts from 'echarts';
import AxiosLogo from '@/assets/logos/Axios.png';
import naiveUILogo from '@/assets/logos/NaiveUI.svg';
import PiniaLogo from '@/assets/logos/Pinia.svg';
import UnoCSSLogo from '@/assets/logos/UnoCSS.svg';
import VueLogo from '@/assets/logos/vue.svg';
import ViteLogo from '/vite.svg';


// Line Chart Option (Access Volume)
const lineChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['访问量', '订单量'],
    top: '0%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#1890ff' }, { offset: 1, color: 'rgba(24,144,255,0.1)' }]
        }
      }
    },
    {
      name: '订单量',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310],
      itemStyle: { color: '#2fc25b' }
    }
  ]
}));

const techStack = [
  { name: 'Vue 3', description: '渐进式 JavaScript 框架', icon: VueLogo },
  { name: 'Vite', description: '下一代前端开发与构建工具', icon: ViteLogo },
  { name: 'Naive UI', description: '一个 Vue 3 组件库', icon: naiveUILogo },
  { name: 'Pinia', description: 'Vue 的专属状态管理库', icon: PiniaLogo },
  { name: 'Vue Router', description: 'Vue.js 的官方路由', icon: 'i-mdi-routes text-green-500' },
  { name: 'UnoCSS', description: '即时按需原子 CSS 引擎', icon: UnoCSSLogo },
  { name: 'Axios', description: '基于 Promise 的 HTTP 客户端', icon: AxiosLogo },
  { name: 'ECharts', description: '强大的交互式图表库', icon: 'i-mdi-chart-bar text-red-500' },
  { name: 'MockJS', description: '生成随机数据，拦截 Ajax 请求', icon: 'i-mdi-database text-orange-500' },
];
</script>

<style scoped>
.home-container {
  padding: 16px;
}
</style>
