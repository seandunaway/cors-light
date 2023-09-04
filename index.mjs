#!/usr/bin/env node

import {createServer} from 'node:http'

let whitelist = [
    'https://query1.finance.yahoo.com/v8/finance/chart/',
]

let port = process.argv[2] ?? 8888
let server = createServer()
server.listen(port)

server.on('listening', function () {
    console.info(new Date(), 'cors-light', port)
})

server.on('request', async function (request, response) {
    if (!request.url || !request.method) return

    let url = request.url.slice(1, request.url.length)
    for (let item of whitelist) {
        if (!url.startsWith(item)) {
            console.error('!', url)
            response.statusCode = 403
            response.end()
            return
        }
    }

    console.info(url)
    let fetch_response = await fetch(url)
    let fetch_text = await fetch_response.text()

    response.statusCode = fetch_response.status
    response.end(fetch_text)
})

// @todo method and body
