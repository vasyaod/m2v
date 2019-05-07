import { List } from 'immutable'

const url = "http://localhost:8882"

export async function startEncoding() {
  const response = await fetch(`${url}/video`, {
    method: "POST",
  })

  return await response.text()
}

export async function saveFrame(encodeId, frameId, data) {

  const response1 = await fetch(`${url}/video/${encodeId}/${frameId}`, {
    method: "POST",
    headers: {
      'Content-type': 'application/octet-stream'
    },
    body: data
  })
  await response1.text()
}

export async function downloadVideo(encodeId) {
  const response = await fetch(`http://localhost:8081/video/${encodeId}`, {
    method: "GET",
  })
  const json = await response.json()
}
