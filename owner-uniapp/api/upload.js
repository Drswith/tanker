import { request } from '@/utils/http'

/**
 * 文件上传API
 */
export const uploadApi = {
  // 上传图片
  uploadImage(filePath, formData = {}) {
    return request.upload('/api/upload/image', filePath, formData)
  },

  // 上传文件
  uploadFile(filePath, formData = {}) {
    return request.upload('/api/upload/file', filePath, formData)
  },
}

export default uploadApi