export const tokenKey = 'token'

export function getToken() {
  return uni.getStorageSync(tokenKey)
}

export function setToken(token) {
  if (!token) {
    throw new Error('token不能为空')
  }
  return uni.setStorageSync(tokenKey, token)
}

export function clearToken() {
  return uni.removeStorageSync(tokenKey)
}

export const tokenInfosKey = 'tokenInfos'

export function getTokenInfos() {
  return uni.getStorageSync(tokenInfosKey)
}

export function setTokenInfos(tokenInfos) {
  if (!tokenInfos) {
    throw new Error('tokenInfos不能为空')
  }
  return uni.setStorageSync(tokenInfosKey, tokenInfos)
}

export function clearTokenInfos() {
  return uni.removeStorageSync(tokenInfosKey)
}

export const userInfoKey = 'userInfo'

export function getUserInfo() {
  return uni.getStorageSync(userInfoKey)
}

export function setUserInfo(userInfo) {
  if (!userInfo) {
    throw new Error('userInfo不能为空')
  }
  return uni.setStorageSync(userInfoKey, userInfo)
}

export function clearUserInfo() {
  return uni.removeStorageSync(userInfoKey)
}
