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
            response.statusCode = 403
            response.end()
            console.error('!', url)
            return
        }
    }

    let host
    let host_match = url.match(/\/\/(.+?)\//)
    if (host_match) host = host_match[1]

    let fetch_options = {
        method: request.method,
        headers: {
            ...request.headers,
            host,
        },
    }

    let fetch_response = await fetch(url, fetch_options)
    let fetch_body = await fetch_response.text()

    response.statusCode = fetch_response.status
    response.end(fetch_body)
    console.info(response.statusCode, url)
})

// @todo body
