const path = require('path');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './server/database/summoner.db'
    },
    useNullAsDefault: true
  })

exports.summonersAll = async (req, res) => {
  knex
    .select('*')
    .from('summoner') 
    .then(userData => {
      res.json(userData)
    })
    .catch(error => {
        
      res.json({ message: `There was an error retrieving summoners: ${err}` })
    })
}

exports.summonerCreate = async (req, res) => {
  knex('summoner')
    .insert({ 
      'puuid': req.body.puuid,
      'server': req.body.server,
      'gameName': req.body.gameName,
    })
    .then(() => {
      res.json({ message: `Summoner \'${req.body.gameName}\' entry created.` })
    })
    .catch(err => {
      res.json({ message: `There was an error creating summoner ${req.body.puuid} entry: ${err}` })
    })
}

exports.summonerDelete = async (req, res) => {
  knex('summoner')
    .where('puuid', req.body.puuid)
    .del()
    .then(() => {
      res.json({ message: `Summoner ${req.body.puuid} deleted.` })
    })
    .catch(err => {
      res.json({ message: `There was an error deleting summoner ${req.body.gameName}: ${err}` })
    })
}

exports.summonersReset = async (req, res) => {
  knex
    .select('*') 
    .from('summoner') 
    .truncate() 
    .then(() => {
      res.json({ message: 'Summoner list cleared.' })
    })
    .catch(err => {
      res.json({ message: `There was an error resetting summoner list: ${err}.` })
    })
}