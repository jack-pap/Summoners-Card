const matchEntry = require("../../src/components/MatchEntry.jsx");

// function getMatchTimeAgo(gameDate) {
//     const milliseconds = Date.now() - new Date(gameDate);
//     const seconds = Math.floor(milliseconds / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (days > 0) {
//       return days === 1 ? "A day ago" : `${days} days ago`;
//     } else if (hours > 0) {
//       return hours === 1 ? "An hour ago" : `${hours} hours ago`;
//     } else if (minutes >= 0) {
//       return minutes === 1 ? "A minute ago" : `${minutes} minutes ago`;
//     }
//   }

const yearAgo = new Date(new Date() - 1000 * 60 * 60 * 24 * 365);
const dayAgo = new Date(new Date() - 1000 * 60 * 60 * 24);
const hoursAgo = new Date(new Date() - 1000 * 60 * 60 * 5);
const hourAgo = new Date(new Date() - 1000 * 60 * 60);
const minutesAgo = new Date(new Date() - 1000 * 60 * 5);
const minuteAgo = new Date(new Date() - 1000 * 60);
const secondsAgo = new Date(new Date() - 1000);

describe("getMatchTimeAgo function tests", () => {
  test("Over a year ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(yearAgo)).toBe("365 days ago");
  });

  test("One day ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(dayAgo)).toBe("A day ago");
  });

  test("Hours ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(hoursAgo)).toBe("5 hours ago");
  });

  test("One hour ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(hourAgo)).toBe("An hour ago");
  });

  test("Minutes ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(minutesAgo)).toBe("5 minutes ago");
  });

  test("One minute ago match date", () => {
    expect(matchEntry.getMatchTimeAgo(minuteAgo)).toBe("A minute ago");
  });
});

test("Seconds ago match date", () => {
  expect(matchEntry.getMatchTimeAgo(secondsAgo)).toBe("0 minutes ago");
});