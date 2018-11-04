'use strict'

/* eslint-disable max-nested-callbacks */

const Promise = require('bluebird')
const httpStatus = require('http-status')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const weatherService = require('../../../server/weather/weatherService')
const server = require('./../../../server.js')

chai.should()
chai.use(sinonChai)

const apiResponse = {
  'name': 'Mumbai',
  'coord': {
    'lon': 73.02,
    'lat': 19.04
  },
  'weather': [
    {
      'id': 500,
      'main': 'Rain',
      'description': 'light rain',
      'icon': '10d'
    }
  ]
}

describe('## Weather APIs', () => {
  describe('# GET /getWeatherByCityName', () => {
    const cityName = 'Mumbai'
    let getWeatherByCityNameStub

    it('should return weather for the given city', async () => {
      // mock getWeatherByCityName
      getWeatherByCityNameStub = sinon.stub(weatherService, 'getWeatherByCityName').callsFake(async () => {
        return Promise.resolve(apiResponse)
      })

      const options = {
        method: 'GET',
        url: `/getWeatherByCityName?cityName=${cityName}`
      }

      const res = await server.inject(options)
      res.statusCode.should.equal(httpStatus.OK)
      getWeatherByCityNameStub.should.have.been.calledWith(cityName)
      res.result.should.deep.equal(apiResponse)

      // restore mock
      getWeatherByCityNameStub.restore()
    })

    it('should return internal server error', async () => {
      // mock getWeatherByCityName
      getWeatherByCityNameStub = sinon.stub(weatherService, 'getWeatherByCityName').callsFake(async () => {
        return Promise.reject(new Error(`Failed to fetch weather for ${cityName}`))
      })

      const options = {
        method: 'GET',
        url: `/getWeatherByCityName?cityName=${cityName}`
      }

      const res = await server.inject(options)
      res.statusCode.should.equal(httpStatus.INTERNAL_SERVER_ERROR)
      getWeatherByCityNameStub.should.have.been.calledWith(cityName)

      // restore mock
      getWeatherByCityNameStub.restore()
    })

    it('should return an error if cityName is not present', async () => {
      const options = {
        method: 'GET',
        url: `/getWeatherByCityName`
      }

      const res = await server.inject(options)
      res.statusCode.should.equal(httpStatus.BAD_REQUEST)
    })
  })
})
