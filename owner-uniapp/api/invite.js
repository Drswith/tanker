import { request } from '@/utils/http'

export const inviteApi = {
  // 获取邀请列表
  getInviteList(data) {
    return request.get('/api/invite_record/list', data)
  },
}
