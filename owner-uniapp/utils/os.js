/**
 * 获取当前操作系统
 * @description 获取当前操作系统
 * @returns {string} ios android harmony unknown
 */
export function checkSystem() {
  const deviceInfo = uni.getDeviceInfo()
  const isIos = deviceInfo.system.includes('iOS')
  const isAndroid = deviceInfo.system.includes('Android')
  const isHarmony = deviceInfo.system.includes('HarmonyOS')

  console.warn('[SYSTEM] 终端信息', deviceInfo)
  let os = 'unknown'
  if (isIos) {
    console.warn('[SYSTEM] Running at iOS')
    os = 'ios'
  }
  else if (isAndroid) {
    console.warn('[SYSTEM] Running at Android')
    os = 'android'
  }
  else if (isHarmony) {
    console.warn('[SYSTEM] Running at HarmonyOS')
    os = 'harmony'
  }
  else {
    console.warn('[SYSTEM] 未知操作系统')
  }
  return os
}
