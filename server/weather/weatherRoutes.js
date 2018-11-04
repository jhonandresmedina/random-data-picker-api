'use strict'

const weatherHandler = require('./weatherHandler')
const weatherValidations = require('./weatherValidations')

const routes = []

// GET /getWeatherByCityName
routes.push({
  path: '/getWeatherByCityName',
  method: 'GET',
  handler: weatherHandler.getWeatherByCityName,
  config: {
    tags: ['api'],
    validate: weatherValidations.getWeatherByCityName
  }
})

module.exports = routes
