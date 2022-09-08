import 'reflect-metadata'
import Container from 'typedi'
import api from './api'
import constants from './config/constants'
import setup from './config/setup'

const PORT = +(process.env.PORT ?? 4000)

setup()

api({port: PORT})

console.log(`Backend server started on port ${PORT}`)
