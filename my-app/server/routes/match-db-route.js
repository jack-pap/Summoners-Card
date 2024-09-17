const express = require('express')

const matchRoutes = require('./../controller/databaseController.js')

const router = express.Router()

// In server.js, match route is specified as '/match'
// this means that '/{route}' translates to '/match/{route}'

// Route for GET request to retrieve all matches
router.get('/allMatches', matchRoutes.matchesAll)

// Route for GET request to retrieve specific summoner matches
router.get('/getMatches', matchRoutes.summonerMatches)

// Route for GET request to retrieve matches based on certain date
router.get('/getMoreMatches', matchRoutes.summonerExtendedMatches)

// Route for GET request to retrieve a specific match entry
router.get('/getMatch', matchRoutes.matchSpecific)

// Route for GET request to retrieve match info for a specific match
router.get('/getMatchInfo', matchRoutes.matchSpecificInfo)

// Route for POST request to create new match
router.post('/createMatch', matchRoutes.matchCreate)

// Route for PUT request to delete specific match
router.put('/deleteMatch', matchRoutes.matchDelete)

// Route for PUT request to reset matches list
router.put('/resetMatches', matchRoutes.matchesReset)

module.exports = router