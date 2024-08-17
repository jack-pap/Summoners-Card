require('dotenv').config();
const SQL_PASS = process.env.SQL_PASSWORD;

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: SQL_PASS,
      database: 'summoner',
    },
  });

exports.summonersAll = async (req, res) => {
  knex
    .select('*')
    .from('summonerInfo') 
    .then(userData => {
      res.json(userData)
    })
    .catch(error => {    
      res.json({ message: `There was an error retrieving all summoners: ${error}` })
    })
}

exports.summonerSpecific = async (req, res) => {
  knex
    .select('*')
    .from('summonerInfo')
    .where('puuid', req.body.puuid)
    .then(userData => {
      res.json(userData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving summoner: ${error}` })
    })
}

  exports.summonerCreate = async (req, res) => {
    knex
      .insert({ 
        'puuid': req.body.puuid,
        'summonerWinrate': req.body.summonerWinrate
      })
      .into('summonerInfo')
      .then(() => {
        res.json({ message: `Summoner \'${req.body.puuid}\' entry created.` })
      })
      .catch(err => {
        res.json({ message: `There was an error creating summoner ${req.body.puuid} entry: ${err}` })
      })
  }

  exports.summonerDelete = async (req, res) => {
    knex('summonerInfo')
      .where('puuid', req.body.puuid)
      .del()
      .then(() => {
        res.json({ message: `Summoner ${req.body.puuid} deleted.` })
      })
      .catch(err => {
        res.json({ message: `There was an error deleting summoner ${req.body.puuid}: ${err}` })
      })
  }

exports.summonersReset = async (req, res) => {
  knex
    .select('*') 
    .from('summonerInfo') 
    .truncate() 
    .then(() => {
      res.json({ message: 'Summoner list cleared.' })
    })
    .catch(err => {
      res.json({ message: `There was an error resetting summoner list: ${err}.` })
    })
}

exports.matchesAll = async (req, res) => {
  knex
    .select('*')
    .from('matchInfo') 
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {    
      res.json({ message: `There was an error retrieving all matches: ${error}` })
    })
}

exports.matchSpecific = async (req, res) => {
  knex
    .select('*')
    .from('matchInfo')
    .where('matchID', req.body.puuid)
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving match: ${error}` })
    })
}

exports.matchCreate = async (req, res) => {
  knex
    .insert({ 
      'puuid': req.body.puuid,
      'matchID': req.body.matchID,
      'matchInfo': req.body.matchInfo,
      'matchDate': req.body.matchDate
    })
    .into('matchInfo')
    .then(() => {
      res.json({ message: `Match \'${req.body.matchID}\' entry created.` })
    })
    .catch(err => {
      res.json({ message: `There was an error creating match ${req.body.matchID} entry: ${err}` })
    })
}

exports.matchDelete = async (req, res) => {
  knex('matchInfo')
    .where('matchID', req.body.matchID)
    .del()
    .then(() => {
      res.json({ message: `Match ${req.body.matchID} deleted.` })
    })
    .catch(err => {
      res.json({ message: `There was an error deleting match ${req.body.matchID}: ${err}` })
    })
}

exports.matchesReset = async (req, res) => {
  knex
    .select('*') 
    .from('matchInfo') 
    .truncate() 
    .then(() => {
      res.json({ message: 'Match list cleared.' })
    })
    .catch(err => {
      res.json({ message: `There was an error resetting match list: ${err}.` })
    })
}

