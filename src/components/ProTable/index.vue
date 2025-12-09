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
            <!-- Select -->
            <n-select
              v-if="item.searchType === 'select'"
              v-model:value="searchParam[item.key]"
              :options="item.searchOptions"
              :placeholder="`请选择${item.title}`"
              clearable
              v-bind="item.searchProps"
              :style="{width:item.width?item.width+'px':'200px'}"
            />
            <!-- Date Picker -->
            <n-date-picker
              v-else-if="item.searchType === 'date'"
              v-model:value="searchParam[item.key]"
              type="date"
              :placeholder="`请选择${item.title}`"
              clearable
              v-bind="item.searchProps"
              class="w-full"
            />
            <!-- Time Picker -->
            <n-time-picker
              v-else-if="item.searchType === 'time'"
              v-model:value="searchParam[item.key]"
              :placeholder="`请选择${item.title}`"
              clearable
              v-bind="item.searchProps"
              class="w-full"
            />
            <!-- Default: Input -->
            <n-input
              v-else
              v-model:value="searchParam[item.key]"
              :placeholder="`请输入${item.title}`"
              clearable
              v-bind="item.searchProps"
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
        :columns="tableColumns"
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
          <template #prefix="{ itemCount }"> 共 {{ itemCount }} 条 </template>
        </n-pagination>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { computed, onMounted, h, watch, useSlots, unref } from "vue";
import { useTable } from "../../hooks/useTable";
import { NIcon, NTag } from "naive-ui";

const slots = useSlots();

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  requestApi: {
    type: Function,
    required: true,
  },
  initParam: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "",
  },
});

// 处理列配置，支持 slot 和 enum 自动渲染
const tableColumns = computed(() => {
  return props.columns.map((item) => {
    // 如果有自定义 render，直接返回
    if (item.render) return item;
    // 如果有对应的 slot，使用 slot 渲染
    if (slots[item.key]) {
      return {
        ...item,
        render(row) {
          return slots[item.key]({ row });
        },
      };
    }
    // 如果有 enum，自动渲染 label
    if (item.enum) {
      return {
        ...item,
        render(row) {
          const value = row[item.key];
          if (!value && value !== 0) return "--";
          // 兼容 enum 为 Ref 的情况
          const enumData = unref(item.enum);
          const dictItem = enumData.find((v) => v.value === value);
          if (dictItem) {
            if (dictItem.tagType) {
              return h(
                NTag,
                { type: dictItem.tagType, bordered: false },
                { default: () => dictItem.label }
              );
            }
            return dictItem.label;
          }
          return value;
        },
      };
    }
    return item;
  });
});

// 过滤出需要搜索的列
const searchColumns = computed(() => {
  return props.columns
    .filter((item) => item.search)
    .map((item) => {
      // 如果有 enum 且没有 searchOptions，自动使用 enum 作为 options
      if (item.enum && !item.searchOptions) {
        return {
          ...item,
          searchOptions: unref(item.enum), // 兼容 Ref
        };
      }
      return item;
    });
});

const showSearch = computed(() => searchColumns.value.length > 0);

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
  handleCurrentChange,
} = useTable(props.requestApi, props.initParam);
watch(
  () => tableData.value,
  (newVal) => {},
  { deep: true, immediate: true }
);

// 初始化加载
onMounted(() => {
  getTableList();
});

// 暴露给父组件
defineExpose({
  search,
  reset,
  getTableList,
});
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
