<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <n-card class="search-form" v-if="showSearch">
      <n-form
        ref="searchFormRef"
        :model="searchParam"
        label-placement="left"
        inline
        :show-feedback="false"
      >
        <template v-for="item in searchColumns" :key="item.key">
          <n-form-item :label="item.title" :path="item.key">
            <n-input
              v-model:value="searchParam[item.key]"
              :placeholder="`请输入${item.title}`"
              clearable
            />
          </n-form-item>
        </template>
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="search">搜索</n-button>
            <n-button @click="reset">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

    <!-- 表格主体 -->
    <n-card class="table-main">
      <!-- 表格头部 -->
      <div class="table-header">
        <div class="header-left">
          <slot name="tableHeader"></slot>
        </div>
        <div class="header-right">
          <slot name="toolButton"></slot>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button circle quaternary @click="getTableList">
                <template #icon>
                  <n-icon>
                    <div class="i-mdi-refresh" />
                  </n-icon>
                </template>
              </n-button>
            </template>
            刷新
          </n-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="false"
        :bordered="true"
        :single-line="false"
     
      />

      <!-- 分页 -->
      <div class="table-pagination">
        <n-pagination
          v-model:page="pageable.pageNum"
          v-model:page-size="pageable.pageSize"
          :item-count="pageable.total"
          :page-sizes="[10, 20, 50, 100]"
          show-size-picker
          show-quick-jumper
          @update:page="handleCurrentChange"
          @update:page-size="handleSizeChange"
        >
          <template #prefix="{ itemCount }">
            共 {{ itemCount }} 条
          </template>
        </n-pagination>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { computed, onMounted, h, watch } from 'vue'
import { useTable } from '../../hooks/useTable'
import { NIcon } from 'naive-ui'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  requestApi: {
    type: Function,
    required: true
  },
  initParam: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  }
})

// 过滤出需要搜索的列
const searchColumns = computed(() => {
  return props.columns.filter(item => item.search)
})

const showSearch = computed(() => searchColumns.value.length > 0)

// 使用 hook
const {
  tableData,
  pageable,
  loading,
  searchParam,
  search,
  reset,
  getTableList,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam)
watch(
  () => tableData.value,
  (newVal) => {

  },
  { deep: true, immediate: true }
)

// 初始化加载
onMounted(() => {
  getTableList()
})

// 暴露给父组件
defineExpose({
  search,
  reset,
  getTableList
})
</script>

<style scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.search-form {
  /* background-color: var(--n-color); */
  /* padding: 18px; */
  border-radius: 4px;
  transition: background-color 0.3s;
}

.table-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: var(--n-color); */
  /* padding: 18px; */
  border-radius: 4px;
  overflow: hidden;
  transition: background-color 0.3s;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
