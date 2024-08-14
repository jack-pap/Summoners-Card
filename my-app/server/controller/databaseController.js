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
        
      res.json({ message: `There was an error retrieving summoners: ${error}` })
    })
}

exports.summonerCreate = async (req, res) => {
  knex('summonerInfo')
    .insert({ 
      'puuid': req.body.puuid,
      'summonerWinrate': req.body.summonerWinrate,
    })
    .then(() => {
      res.json({ message: `Summoner \'${req.body.gameName}\' entry created.` })
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
      res.json({ message: `There was an error deleting summoner ${req.body.gameName}: ${err}` })
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