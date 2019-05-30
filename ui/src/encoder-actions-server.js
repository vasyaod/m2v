import { List } from 'immutable'
import * as config from './config.js'

export async function startEncoding() {
  const response = await fetch(`${config.renderServerUrl}/video`, {
    method: "POST",
  })

  return await response.text()
}

export async function saveFrame(encodeId, frameId, data) {

  const response1 = await fetch(`${config.renderServerUrl}/video/${encodeId}/${frameId}`, {
    method: "POST",
    headers: {
      'Content-type': 'application/octet-stream'
    },
    body: data
  })
  await response1.text()
}

export async function downloadVideo(encodeId) {
  const response = await fetch(`${config.renderServerUrl}/video/${encodeId}`, {
    method: "GET",
  })
  const json = await response.json()
}
