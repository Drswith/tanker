export const tokenKey = 'token'

const storage = {
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
        // 如果JSON解析失败，可能是普通字符串，直接返回
        console.warn(`JSON解析失败，返回原始值: ${key}`, parseError)
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

export function getToken() {
  return storage.get(tokenKey)
}

export function setToken(token) {
  return storage.set(tokenKey, token)
}

export function clearToken() {
  return storage.remove(tokenKey)
}

export const tokenInfosKey = 'tokenInfos'

export function getTokenInfos() {
  return storage.get(tokenInfosKey)
}

export function setTokenInfos(tokenInfos) {
  if (!tokenInfos) {
    throw new Error('tokenInfos不能为空')
  }
  return storage.set(tokenInfosKey, tokenInfos)
}

export function clearTokenInfos() {
  return storage.remove(tokenInfosKey)
}

export const userInfoKey = 'userInfo'

export function getUserInfo() {
  return storage.get(userInfoKey)
}

export function setUserInfo(userInfo) {
  if (!userInfo) {
    throw new Error('userInfo不能为空')
  }
  return storage.set(userInfoKey, userInfo)
}

export function clearUserInfo() {
  return storage.remove(userInfoKey)
}
