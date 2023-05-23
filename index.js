const express = require("express");
const axios = require("axios");
const cors = require('cors');
const app = express();
require('dotenv').config();

const GET_MATCHES_BY_PUUID = "lol/match/v5/matches/by-puuid/";
const GET_MATCH_BY_ID = "lol/match/v5/matches/";
const GET_CHAMPION_MASTERIES = "lol/champion-mastery/v4/champion-masteries/by-summoner/";
const GET_ITEM_DATA = "https://ddragon.leagueoflegends.com/cdn/13.9.1/data/en_US/item.json";
const GET_PATCH_VERSION = "https://ddragon.leagueoflegends.com/api/versions.json";
const GET_PLAYER_LIVE_GAME = "lol/spectator/v4/active-games/by-summoner/";
const GET_SUMMONER_SPELLS = "https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/summoner.json";
const BASE_URL_API = "https://eun1.api.riotgames.com/";
const GET_USER_BY_NAME = "lol/summoner/v4/summoners/by-name/";
const GET_USER_RANKS = "lol/league/v4/entries/by-summoner/";

app.use(express.json());

app.use((req, res, next) => {
  req.apiKey = process.env.API_KEY;
  next();
});

const port = process.env.PORT || 8000


const allowedOrigins = [
  process.env.LOCAL_ORIGIN,
  process.env.APP_ORIGIN,
  process.env.APP_ORIGIN_SECOND,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.get("/api/user/:summonerName", async (req, res) => {
  try {
    const summonerName = req.params.summonerName;
    const response = await axios.get(
      `${BASE_URL_API}${GET_USER_BY_NAME}${summonerName}`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/userranks/:summonerId", async (req, res) => {
  try {
    const summonerId = req.params.summonerId;
    const response = await axios.get(
      `${BASE_URL_API}${GET_USER_RANKS}${summonerId}`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/mostplayedchamps/:summonerId", async (req, res) => {
  try {
    const summonerId = req.params.summonerId;
    const response = await axios.get(
      `${BASE_URL_API}${GET_CHAMPION_MASTERIES}${summonerId}`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/matchids/:puuid", async (req, res) => {
  try {
    const puuid = req.params.puuid;
    const response = await axios.get(
      `${BASE_URL_API}${GET_MATCHES_BY_PUUID}${puuid}/ids`,
      {
        headers: { "X-Riot-Token": req.apiKey },
        params: {
          start: 0,
          count: 10,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/match/:matchId", async (req, res) => {
  try {
    const matchId = req.params.matchId;
    console.log(matchId);
    const response = await axios.get(`https://europe.api.riotgames.com/${GET_MATCH_BY_ID}${matchId}`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/match-timeline/:matchId", async (req, res) => {
  try {
    const matchId = req.params.matchId;
    console.log(matchId);
    const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/itemdata", async (req, res) => {
  try {
    const response = await axios.get(GET_ITEM_DATA);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/patchversion", async (req, res) => {
  try {
    const response = await axios.get(GET_PATCH_VERSION);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/challengerleague/:que/:league", async (req, res) => {
  try {
      console.log('usao ovde?')
    const que = req.params.que;
    const league = req.params.league;
    const response = await axios.get(`https://eun1.api.riotgames.com/lol/league/v4/${league}leagues/by-queue/${que}`,
      {headers: { 'X-Riot-Token': req.apiKey }}
    );
    res.json(response.data.entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/playerlivegame/:summonerId", async (req, res) => {
  try {
    const summonerId = req.params.summonerId;
    const response = await axios.get(
      `${BASE_URL_API}${GET_PLAYER_LIVE_GAME}${summonerId}`,
      {
        headers: { "X-Riot-Token": req.apiKey },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Summoner not in game" });
  }
});

app.get("/api/summonerspells/:version", async (req, res) => {
  try {
    const version = req.params.version;
    const url = GET_SUMMONER_SPELLS.replace("{version}", version);
    const response = await axios.get(url);
    res.json(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/matchids/:puuid', async (req, res) => {
    try {
      const puuid = req.params.puuid;
      const { start, count } = req.query;
  
      const matchIdsResponse = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        headers: { 'X-Riot-Token': req.apiKey },
        params: {
          start: start || 0,
          count: count || 10,
        },
      });
  
      const matchIds = matchIdsResponse.data;
  
      const matches = await Promise.all(matchIds.map(async (matchId) => {
        const matchResponse = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
          headers: { 'X-Riot-Token': req.apiKey },
        });
        return matchResponse.data;
      }));
  
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/api/fetchalldata/:summonerName', async (req, res) => {
    try {
      const summonerName = req.params.summonerName;
  
      // Get user data
      const userResponse = await axios.get(`${BASE_URL_API}${GET_USER_BY_NAME}${summonerName}`, {
        headers: { 'X-Riot-Token': req.apiKey },
      });
      const user = userResponse.data;
  
      // Get user ranks
      const ranksResponse = await axios.get(`${BASE_URL_API}${GET_USER_RANKS}${user.id}`, {
        headers: { 'X-Riot-Token': req.apiKey },
      });
      const ranks = ranksResponse.data;
  
      // Get most played champions
      const champsResponse = await axios.get(`${BASE_URL_API}lol/champion-mastery/v4/champion-masteries/by-summoner/${user.id}/top`, {
        headers: { 'X-Riot-Token': req.apiKey },
      });
      const champs = champsResponse.data;
  
      // Get match IDs by PUUID
      const matchIdsResponse = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${user.puuid}/ids?start=0&count=10`, {
        headers: { 'X-Riot-Token': req.apiKey },
      });
      const matchIds = matchIdsResponse.data;
  
      // Get match data for each match ID
      const matches = await Promise.all(matchIds.map(async (matchId) => {
        const matchResponse = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
          headers: { 'X-Riot-Token': req.apiKey },
        });
        return matchResponse.data;
      }));
  
      res.json({
        user,
        ranks,
        champs,
        matches,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;