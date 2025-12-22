/**
 * 统一的响应格式 wrapper
 * 用于前端处理 API 响应
 */

export const handleApiResponse = (response) => {
  // 如果响应已经是正确的格式，直接返回 data
  if (response && typeof response === 'object') {
    return response.data || response
  }
  return response
}

/**
 * 创建标准的错误对象
 */
export const createErrorResponse = (msg, code = -1, data = null) => {
  return {
    code,
    msg,
    data
  }
}
