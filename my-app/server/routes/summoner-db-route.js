const express = require('express')

const summonerRoutes = require('./../controller/databaseController.js')

const router = express.Router()

// In server.js, summoner route is specified as '/summoner'
// this means that '/{route}' translates to '/summoner/{route}'

// Add route for GET request to retrieve all summoner
router.get('/allSummoners', summonerRoutes.summonersAll)

// Add route for GET request to retrieve specific summoner
router.get('/getSummoner', summonerRoutes.summonerSpecific)

// Add route for POST request to create new summoner
router.post('/createSummoner', summonerRoutes.summonerCreate)

// Add route for PUT request to update existing summoner
// router.post('/updateSummoner', summonerRoutes.summonerUpdate)

// Add route for PUT request to delete specific summoner
router.put('/deleteSummoner', summonerRoutes.summonerDelete)

// Add route for PUT request to reset summoners list
router.put('/resetSummoners', summonerRoutes.summonersReset)

module.exports = router