import { request } from '@/utils/http'

export const messageApi = {
  // 获取消息列表
  getMessageList(data) {
    return request.get('/api/system_msg/search', data)
  },

  // 标记消息为已读
  markMessageRead(id) {
    return request.get(`/api/system_msg/read/${id}`)
  },

  // 删除消息
  deleteMessage(id) {
    return request.delete(`/api/system_msg/${id}`)
  },
}
