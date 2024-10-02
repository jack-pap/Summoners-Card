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

  async function createTables() {
    await knex.schema.createTable('summonerInfo', (table) => {
      table.string('puuid').primary();
      table.json('summonerWinrate').notNullable();
      table.dateTime('lastUpdatedDate').notNullable();
    });
  
    await knex.schema.createTable('matchInfo', (table) => {
      table.string('puuid').notNullable();
      table.string('matchID').primary();
      table.json('matchInfo').notNullable();
      table.dateTime('matchDate').notNullable();
      table.foreign('puuid').references('summonerInfo.puuid').onDelete('CASCADE');
    });
  
    console.log('Tables created successfully');
  }

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
        'summonerWinrate': req.body.summonerWinrate,
        'lastUpdatedDate': req.body.lastUpdatedDate
      })
      .into('summonerInfo')
      .onConflict('puuid')
      .merge(['puuid', 'summonerWinrate', 'lastUpdatedDate'])
      .then(() => {
        res.json({ message: `Summoner \'${req.body.puuid}\' entry created/updated.` })
      })
      .catch(err => {
        res.json({ message: `There was an error creating/updating summoner ${req.body.puuid} entry: ${err}` })
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

exports.summonerMatches = async (req, res) => {
  knex
    .select('matchID')
    .from('matchInfo')
    .where('puuid', req.query.puuid)
    .orderBy('matchDate', 'desc')
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving summoner's matches: ${error}` })
    })
}

exports.summonerExtendedMatches = async (req, res) => {
  knex
    .select('matchID')
    .from('matchInfo')
    .limit(10)
    .where('puuid', req.query.puuid)
    .andWhere('matchDate', '<', req.query.matchDate)
    .orderBy('matchDate', 'desc')
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving summoner's matches: ${error}` })
    })
}

exports.matchSpecific = async (req, res) => {
  knex
    .select('*')
    .from('matchInfo')
    .where('matchID', req.query.matchID)
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving match: ${error}`})
    })
}

exports.matchSpecificSummoner = async (req, res) => {
  knex
    .select('*')
    .from('matchInfo')
    .where('matchID', req.query.matchID)
    .andWhere('puuid', req.query.puuid)
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving summoner's match: ${error}`})
    })
}

exports.matchSpecificInfo = async (req, res) => {
  knex
    .select('matchInfo')
    .from('matchInfo')
    .where('matchID', req.query.matchID)
    .andWhere('puuid', req.query.puuid)
    .then(matchData => {
      res.json(matchData)
    })
    .catch(error => {
      res.json({ message: `There was an error retrieving info for match ${req.query.matchID}: ${error}` })
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

