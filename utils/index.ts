import type { voteType } from "~/types"

export function getRedisKey(uid:string) {
  return `$$$-${uid}`
}

export function createNewData(): voteType {
  return {
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0,
    r5: 0
  }
}