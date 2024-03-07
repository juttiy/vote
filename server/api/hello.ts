import { H3Event } from 'h3'
export default function defineEventHandler(event: H3Event): Promise<unknown> {
  return 'hello,' + event.node.req.url
  // return 'hello' + event.node.req
}