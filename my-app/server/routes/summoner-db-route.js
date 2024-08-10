const express = require('express')

const summonerRoutes = require('./../controller/databaseController.js')

const router = express.Router()

// In server.js, summoner route is specified as '/summoner'
// this means that '/{route}' translates to '/summoner/{route}'

// Add route for GET request to retrieve all book
router.get('/all', summonerRoutes.summonersAll)

// Add route for POST request to create new summoner
router.post('/create', summonerRoutes.summonerCreate)

// Add route for PUT request to delete specific summoner
router.put('/delete', summonerRoutes.summonerDelete)

// Add route for PUT request to reset summoners list
router.put('/reset', summonerRoutes.summonersReset)

module.exports = router