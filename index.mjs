#!/usr/bin/env node

import {createServer} from 'node:http'

const whitelist = [
    'https://query1.finance.yahoo.com/v8/finance/chart/',
]

const port = process.argv[2] ?? 8888
const server = createServer()
server.listen(port)

server.on('listening', function () {
    console.info(new Date(), 'cors-light', port)
})

server.on('request', async function (request, response) {
    if (!request.url || !request.method) return

    const url = request.url.slice(1, request.url.length)
    for (const item of whitelist) {
        if (!url.startsWith(item)) {
            response.statusCode = 403
            response.end()
            console.error('!', url)
            return
        }
    }

    let host
    const host_match = url.match(/\/\/(.+?)\//)
    if (host_match) host = host_match[1]

    let fetch_options = {method: request.method}
    fetch_options.headers = request.headers
    fetch_options.headers.host = host

    const fetch_response = await fetch(url, fetch_options)
    const fetch_body = await fetch_response.text()

    response.statusCode = fetch_response.status
    response.end(fetch_body)
    console.info(response.statusCode, url)
})

// @todo body
