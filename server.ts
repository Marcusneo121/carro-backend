/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import { readFileSync } from 'fs';
import { join } from 'path';
import { createServer } from 'https';

sourceMapSupport.install({ handleUncaughtExceptions: false })

const privateKey = readFileSync(join(__dirname + '/cert/key.pem'));
const certificate = readFileSync(join(__dirname + '/cert/cert.pem'));
const credentials = { key: privateKey, cert: certificate };

// new Ignitor(__dirname).httpServer().start()

new Ignitor(__dirname)
    .httpServer()
    .start(
        (handle) => {
            return createServer(credentials, handle);
        }
    )
    .catch(console.error)
