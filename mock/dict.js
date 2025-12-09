const dictMap = {
  gender: [
    { label: "男", value: "男" },
    { label: "女", value: "女" },
  ],
  user_status: [
    { label: "启用", value: 1, tagType: "success" },
    { label: "禁用", value: 0, tagType: "error" },
  ],
  user_role: [
    { label: "管理员", value: "admin", tagType: "primary" },
    { label: "普通用户", value: "user", tagType: "default" },
  ],
};

export default [
  {
    url: "/api/dict/list",
    method: "get",
    response: ({ query }) => {
      const { code } = query;
      if (code && dictMap[code]) {
        return {
          code: 200,
          msg: "获取成功",
          data: dictMap[code],
        };
      }
      return {
        code: 200,
        msg: "获取成功",
        data: [],
      };
    },
  },
];
