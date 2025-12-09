<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :requestApi="getUserList"
      :initParam="initParam"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <n-button type="primary" v-auth="['admin']" @click="handleAdd">
          <template #icon>
            <n-icon><div class="i-mdi-plus" /></n-icon>
          </template>
          新增用户
        </n-button>
      </template>

      <!-- 表格操作 -->
      <template #action="scope">
        <n-space>
          <n-button
            size="small"
            type="primary"
            quaternary
            @click="handleEdit(scope.row)"
          >
            编辑
          </n-button>
          <n-button
            size="small"
            type="error"
            quaternary
            @click="handleDelete(scope.row)"
          >
            删除
          </n-button>
        </n-space>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { ref, h, reactive } from "vue";
import { NTag, NSwitch, useMessage, useDialog } from "naive-ui";
import ProTable from "@/components/ProTable/index.vue";
import { getUserList } from "@/api/user";
import { useDict } from "@/hooks/useDict";

const message = useMessage();
const dialog = useDialog();
const proTable = ref(null);

// 获取字典
const { gender, user_status, user_role } = useDict(
  "gender",
  "user_status",
  "user_role"
);


const initParam = reactive({});

const columns = [
  {
    title: "ID",
    key: "id",
    width: 80,
  },
  {
    title: "用户名",
    key: "username",
    search: true, // 开启搜索
  },
  {
    title: "真实姓名",
    key: "realName",
  },
  {
    title: "性别",
    key: "gender",
    width: 100,
    search: true,
    searchType: "select",
    enum: gender, // 使用字典
    render(row) {
      // 依然可以使用自定义 render，也可以删掉使用默认的字典回显
      const icon = row.gender === "男" ? "i-mdi-face-man" : "i-mdi-face-woman";
      const color = row.gender === "男" ? "#2080f0" : "#d03050";
      return h(
        "div",
        { style: "display: flex; align-items: center; gap: 4px" },
        [
          h("div", { class: icon, style: { color, fontSize: "18px" } }),
          h("span", null, row.gender),
        ]
      );
    },
  },
  {
    title: "年龄",
    key: "age",
    width: 80,
  },
  {
    title: "角色",
    key: "role",
    enum: user_role,
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    search: true,
    searchType: "select",
    enum: user_status, // 使用字典
    render(row) {
      return h(NSwitch, {
        value: row.status === 1,
        onClick: () => handleStatusChange(row),
      });
    },
  },
  {
    title: "创建时间",
    key: "createTime",
    width: 180,
    search: true,
    searchType: "date",
    searchProps: {
      type: "daterange",
      valueFormat: "yyyy-MM-dd",
    },
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    fixed: "right",
  },
];

const handleAdd = () => {
  message.success("点击了新增用户");
};

const handleEdit = (row) => {
  message.info(`编辑用户：${row.username}`);
};

const handleDelete = (row) => {
  dialog.warning({
    title: "警告",
    content: `确定删除用户 ${row.username} 吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      message.success("删除成功");
      proTable.value?.getTableList();
    },
  });
};

const handleStatusChange = (row) => {
  const newStatus = row.status === 1 ? 0 : 1;
  message.loading("正在切换状态...", { duration: 500 });
  setTimeout(() => {
    row.status = newStatus;
    message.success("状态切换成功");
  }, 500);
};
</script>

<style scoped>
.table-box {
  height: 100%;
}
</style>
