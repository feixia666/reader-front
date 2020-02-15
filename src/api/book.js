import request from '@/utils/request'

export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}
