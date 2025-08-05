/**
 *  封装uni-app的storage支持json自动转str
 */
export const storage = {
  get(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('key必须是非空字符串')
    }
    try {
      const str = uni.getStorageSync(key)
      // 处理空值、空字符串、null、undefined等情况
      if (!str || str === '' || str === 'null' || str === 'undefined') {
        return null
      }
      // 尝试解析JSON，如果不是有效JSON则返回原始字符串
      try {
        return JSON.parse(str)
      }
      catch (parseError) {
        return str
      }
    }
    catch (error) {
      console.error(`获取存储数据失败: ${key}`, error)
      return null
    }
  },
  set(key, value) {
    if (!key || typeof key !== 'string') {
      throw new Error('key必须是非空字符串')
    }

    return uni.setStorageSync(key, typeof value === 'string' ? value : JSON.stringify(value))
  },
  remove(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('key必须是非空字符串')
    }
    return uni.removeStorageSync(key)
  },
}
