import { get } from './base'

export function getTopList() {
  return get('./api/getTopList')
}

export function getTopDetail() {
  return get('./api/getTopDetail')
}
