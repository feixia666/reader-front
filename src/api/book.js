import request from '@/utils/request'

export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}

export function getBook(fileName) {
  return request({
    url: '/book/book',
    method: 'get',
    params: {
      fileName
    }
  })
}
