import { storage } from './storage'

export const tokenKey = 'token'
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

export const userIdKey = 'userId'
export function getUserId() {
  const userId = storage.get(userIdKey)
  // userId = null 或 string, 转成数字
  if (userId !== null && userId !== 'null') {
    return Number.parseInt(userId)
  }
  return userId
}
export function setUserId(userId) {
  if (!userId) {
    throw new Error('userId不能为空')
  }
  return storage.set(userIdKey, userId)
}
export function clearUserId() {
  return storage.remove(userIdKey)
}
