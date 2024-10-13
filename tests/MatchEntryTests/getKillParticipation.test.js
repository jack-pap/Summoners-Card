const matchEntry = require("../../src/components/MatchEntry.jsx");

// Total kills: 35
// Kill participation: 8
const matchInfoNormal = [
  { gameQueueID: 420 },
  {
    win: true,
    kills: 5,
    deaths: 5,
    assists: 3,
  },
  [
    {
      win: true,
      kills: 5,
      deaths: 5,
      assists: 3,
    },
    {
      win: true,
      kills: 10,
      deaths: 4,
      assists: 7,
    },
    {
      win: true,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: true,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: true,
      kills: 3,
      deaths: 6,
      assists: 6,
    },
    {
      win: false,
      kills: 5,
      deaths: 5,
      assists: 3,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
  ],
];

// Total kills: 34
// Kill participation: 0
const matchInfoNoParticipation = [
  { gameQueueID: 420 },
  {
    win: true,
    kills: 0,
    deaths: 5,
    assists: 0,
  },
  [
    {
      win: true,
      kills: 0,
      deaths: 5,
      assists: 0,
    },
    {
      win: true,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: true,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: true,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: true,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: false,
      kills: 5,
      deaths: 5,
      assists: 3,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
  ],
];

// Total kills: 10
// Kill participation: 10
const matchInfoOnlyParticipation = [
  { gameQueueID: 420 },
  {
    win: true,
    kills: 10,
    deaths: 5,
    assists: 0,
  },
  [
    {
      win: true,
      kills: 10,
      deaths: 5,
      assists: 0,
    },
    {
      win: true,
      kills: 0,
      deaths: 4,
      assists: 0,
    },
    {
      win: true,
      kills: 0,
      deaths: 6,
      assists: 0,
    },
    {
      win: true,
      kills: 0,
      deaths: 4,
      assists: 0,
    },
    {
      win: true,
      kills: 0,
      deaths: 6,
      assists: 0,
    },
    {
      win: false,
      kills: 5,
      deaths: 5,
      assists: 3,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
    {
      win: false,
      kills: 12,
      deaths: 4,
      assists: 7,
    },
    {
      win: false,
      kills: 5,
      deaths: 6,
      assists: 6,
    },
  ],
];

describe("getKillParticipation function tests", () => {
  test("Normal participation match", () => {
    expect(matchEntry.getKillParticipation(matchInfoNormal, true)).toBe(23);
  });

  test("No participation match", () => {
    expect(
      matchEntry.getKillParticipation(matchInfoNoParticipation, true)
    ).toBe(0);
  });

  test("Only one participation match", () => {
    expect(
      matchEntry.getKillParticipation(matchInfoOnlyParticipation, true)
    ).toBe(100);
  });
});
