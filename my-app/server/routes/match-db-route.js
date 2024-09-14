const express = require('express')

const matchRoutes = require('./../controller/databaseController.js')

const router = express.Router()

// In server.js, match route is specified as '/match'
// this means that '/{route}' translates to '/match/{route}'

// Add route for GET request to retrieve all matches
router.get('/allMatches', matchRoutes.matchesAll)

// Add route for GET request to retrieve specific summoner matches
router.get('/getMatches', matchRoutes.summonerMatches)

// Add route for GET request to retrieve a specific match
router.get('/getMatch', matchRoutes.matchSpecific)

// Add route for GET request to retrieve match info for a specific match
router.get('/getMatchInfo', matchRoutes.matchSpecificInfo)

// Add route for POST request to create new match
router.post('/createMatch', matchRoutes.matchCreate)

// Add route for PUT request to delete specific match
router.put('/deleteMatch', matchRoutes.matchDelete)

// Add route for PUT request to reset matches list
router.put('/resetMatches', matchRoutes.matchesReset)

module.exports = router