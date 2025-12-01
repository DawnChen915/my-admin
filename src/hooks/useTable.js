import { reactive, computed, toRefs } from 'vue'

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 */
export const useTable = (api, initParam = {}, isPageable = true, dataCallBack) => {
  const state = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    // 查询参数(只包含查询表单里的参数)
    searchParam: {},
    // 初始化默认的查询参数
    initSearchParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},
    loading: false
  })

  /**
   * @description 分页查询参数(只包括分页和表格字段排序，其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      }
    },
    set: (newVal) => {
      console.log('我是分页更新之后的值', newVal)
    }
  })

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {})
      let apiParam = { ...state.totalParam, ...state.searchParam }
      
      state.loading = true
      const res = await api(apiParam)
      console.log('useTable res:', res) // 添加日志
      
      // 如果有回调函数，先处理数据
      if (dataCallBack && typeof dataCallBack === 'function') {
        state.tableData = dataCallBack(res)
      } else {
        // 兼容处理：有些接口返回 list，有些返回 rows，根据实际情况调整
        state.tableData = isPageable ? (res.list || res.rows) : res
      }
      
      // 更新分页总数
      if (isPageable) {
        state.pageable.total = res.total || 0
      }
    } catch (error) {
      console.error(error)
    } finally {
      state.loading = false
    }
  }

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以过滤掉空值等
    const nowSearchParam = {}
    // 防止手动清空输入框后搜索，params 里的值未被清空
    for (let key in state.searchParam) {
      // 某些情况下为空字符串、null、undefined 不传给后端
      if (state.searchParam[key] || state.searchParam[key] === 0 || state.searchParam[key] === false) {
        nowSearchParam[key] = state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
  }

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1
    state.searchParam = { ...state.initSearchParam }
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val) => {
    state.pageable.pageNum = 1
    state.pageable.pageSize = val
    getTableList()
  }

  /**
   * @description 当前页码改变
   * @param {Number} val 当前页码
   * @return void
   * */
  const handleCurrentChange = (val) => {
    state.pageable.pageNum = val
    getTableList()
  }

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange
  }
}
