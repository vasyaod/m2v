
const mocha = require('mocha')
const assert = require('chai').assert
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const FormData = require('form-data')
const Blob = require('blob');

const url = "http://localhost:8081"

describe('Encoder server interface', function () {
  
  let encodeId

  it('should answer for status request', async () => {
    const response = await fetch(`${url}/status`, {
      method: "GET",
    })

    assert(await response.text() == 'Ok')
  })

  it('should create a new encoding stream', async () => {
    const response = await fetch(`${url}/video`, {
      method: "POST",
    })

    encodeId = await response.text()
    assert(encodeId.length > 0)
  })

  it('should receive frames ', async () => {
    
    const response1 = await fetch(`${url}/video/${encodeId}/0`, {
      method: "POST",
      headers: {
        'Content-type': 'application/octet-stream'
      },
      body: fs.readFileSync('./test-frame.png')
    })
    assert(await response1.text() == 'Ok')

    const response2 = await fetch(`${url}/video/${encodeId}/1`, {
      method: "POST",
      headers: {
        'Content-type': 'application/octet-stream'
      },
      body: fs.readFileSync('./test-frame.png')
    })

    assert(await response2.text() == 'Ok')
  })

  it('should return video', async () => {
    
    const response = await fetch(`${url}/video/${encodeId}`, {
      method: "GET"
    })
    assert(await response.status == 200)
   // assert(await response1.text() == 'Ok')
  })
});
