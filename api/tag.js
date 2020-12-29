import { request } from '@/plugins/request'

//获取文标签列表
export const getTags = () => {
  return request({
    method: 'GET',
    url: 'api/tags',
  })
}