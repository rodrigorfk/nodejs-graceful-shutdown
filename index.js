require('console-stamp')(console, '[HH:MM:ss.l]');
const http = require('http')
const express = require('express')
const { createTerminus } = require('@godaddy/terminus')

const appConfig = {
    port: process.env.PORT || 3000,
    shutdownTimeout: process.env.SHUTDOWN_TIMEOUT || 60000,
    shutdownDelay: process.env.SHUTDOWN_DELAY || 40000
}

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const server = http.createServer(app)

function onSignal() {
    console.log('server is starting cleanup')
    return Promise.all([]);
}

function beforeShutdown() {
    console.log(`server will shutdown in ${appConfig.shutdownDelay}ms`)
    return Promise.all([
        promiseWithTimeout(appConfig.shutdownDelay)
    ]);
}

function onHealthCheck() {
    // checks if the system is healthy, like the db connection is live
    // resolves, if health, rejects if not
    return Promise.all([]);
}

createTerminus(server, {
    signal: 'SIGTERM',
    healthChecks: { '/healthcheck': onHealthCheck },
    timeout: appConfig.shutdownTimeout,
    onSignal,
    beforeShutdown
})

server.listen(appConfig.port, () => {
    console.log(`Example app listening at http://localhost:${appConfig.port}`)
})

const promiseWithTimeout = (timeoutMs) => {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), timeoutMs))
}