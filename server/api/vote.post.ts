import { H3Event } from 'h3'
import Redis from 'ioredis'
import { voteBody } from '~/types'
import { createNewData, getRedisKey } from '~/utils'

  
export default defineEventHandler(async function(event: H3Event): Promise<unknown> {
  const redis: Redis = new Redis(process.env.REDIS_URL as string)
  const body: any  = await readBody(event)
  const redisKey = getRedisKey(body?.uid)
  let data 
  let oldData
  try {
    oldData = await redis.get(redisKey)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'failed to fecth stored dataa.' +
        ((error as Error).message || Object.prototype.toString.call(error))
    })
  }
  !oldData ? oldData = createNewData() : oldData = JSON.parse(oldData)


  oldData[body?.vote.vote] = Number(oldData[body?.vote.vote]) + 1
  if(body?.vote.old) {
    oldData[body?.vote.old] = Number(oldData[body?.vote.old]) - 1
  }
  data = JSON.stringify(oldData)
  await redis.set(redisKey, data)
  redis.quit()

  setHeaders(event, {
    'content-type': 'application/json',
    'cache-control': 'public, s-maxage=1800, stale-while-revalidate=2400',
 })

  return oldData
})