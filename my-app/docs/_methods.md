 JSDoc: Global  

# Global

### Methods

#### apiGETDatabaseCall(path, queryRoute) → {Promise}

API GET call to server to request data from the database

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string |     |
| `queryRoute` | string |     |

Source:

*   [server/controller/apiService.js], [line 103]

##### Returns:

Type

Promise

#### apiImageCall(imageURL) → {Promise}

API call to imageURL to get image data

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `imageURL` | string |     |

Source:

*   [server/controller/apiService.js], [line 37]

##### Returns:

Type

Promise

#### apiPOSTDatabaseCall(path, queryRoute, summonerJSONObject) → {Promise}

API POST call to server to create new database entry

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string |     |
| `queryRoute` | string |     |
| `summonerJSONObject` | JSON |     |

Source:

*   [server/controller/apiService.js], [line 66]

##### Returns:

Type

Promise

#### apiPUTDatabaseCall(path, queryRoute, summonerJSONObject) → {Promise}

API PUT call to server to modify data from the database

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string |     |
| `queryRoute` | string |     |
| `summonerJSONObject` | JSON |     |

Source:

*   [server/controller/apiService.js], [line 133]

##### Returns:

Type

Promise

#### apiProxyCall(apiURL) → {Promise}

API call to Riot for data by calling the proxy route server and passing the apiURL endpoint

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `apiURL` | string |     |

Source:

*   [server/controller/apiService.js], [line 8]

##### Returns:

Type

Promise

#### checkIfOwnPlayer(playerName, playerTagLine, playerComponent)

Check to see if the player is the one being displayed on profile in order to highlight it with a different class name

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `playerName` | string |     |
| `playerTagLine` | string |     |
| `playerComponent` | HTMLDivElement |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1199]

#### (async) findMoreMatches(region, puuid) → {Promise.<Array.<Object>, Object>}

Attempts to find more ranked/normal games to fill the desired matchIDs length. If the length cannot be filled it means no games can be found and it returns

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `region` | string |     |
| `puuid` | string |     |
|     |     |     |
|     |     |     |

Source:

*   [src/pages/App.jsx], [line 776]

##### Returns:

Type

Promise.<Array.<Object>, Object>

#### formatDateSQL(timestamp) → {string}

Formats timestamp milliseconds into DATETIME format for entry in MySQL database

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `timestamp` | number |     |

Source:

*   [src/pages/App.jsx], [line 823]

##### Returns:

Type

string

#### (async) getAllChampions() → {Map.<number, string>}

Method to retrieve JSON data of champions to return mapping between their respective ids and names

Source:

*   [src/pages/App.jsx], [line 301]

##### Returns:

Type

Map.<number, string>

#### getChampionWinrate(masteryInfo, matchInfoList)

Method that iterates through matches and calculates champion winrate values

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `masteryInfo` | Map |     |
| `matchInfoList` |     |     |

Source:

*   [src/pages/App.jsx], [line 552]

##### Returns:

#### (async) getInput(serverValue)

Gathers input from field, executes Riot API call based on input to gather user account data

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `serverValue` | string |     |

Source:

*   [src/pages/App.jsx], [line 317]

#### (async) getItemAssets(summonerInfo, divClass, component)

Driver method that sends API call to retrieve item JSON data in order to get icon paths based on item ID

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerInfo` |     |     |
| `divClass` | string |     |
| `component` | HTMLDivElement |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1095]

#### (async) getMasteryInfo(server, puuid)

API call to retrieve arrays of summoner mastery info on all champions played (champion ID, champion mastery level, champion mastery points) based on puuid and server

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `server` | string |     |
| `puuid` | string |     |

Source:

*   [src/pages/App.jsx], [line 494]

##### Returns:

#### getMatchList(puuid, matchAmountStart, matchAmount) → {Promise.<Array.<Object>>}

API call to retrieve an array of summoner match IDs based on puuid - \* @param {string} region

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `puuid` | string |     |
| `matchAmountStart` | number |     |
| `matchAmount` | number |     |

Source:

*   [src/pages/App.jsx], [line 589]

##### Returns:

Type

Promise.<Array.<Object>>

#### (async) getOtherPlayerAssets(participantsInfo, divClass, component)

Creates HTMLDivElement entry to display player name and champion picture retrieved from API call

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `participantsInfo` |     |     |
| `divClass` | string |     |
| `component` | HTMLDivElement |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1170]

#### (async) getPUUID(tagLine, gameName) → {string}

API call to retrieve PUUID identifier based on username

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tagLine` | string |     |
| `gameName` | string |     |

Source:

*   [src/pages/App.jsx], [line 457]

##### Returns:

Type

string

#### (async) getRankedInfo(server, id)

API call to retrieve summoner ranked queue info (wins, losses, rank, tier) based on id and server

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `server` | string |     |
| `id` | string |     |

Source:

*   [src/pages/App.jsx], [line 791]

##### Returns:

#### (async) getRuneImage(runeID, component, divClass, isSecondary)

Sends API call to gather JSON data for runes based on it's type (primary or secondary), sends API call to retrieve image from the iconpath in the JSON data and then creates a HTMLImageElement to append the file image

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `runeID` | number |     |
| `component` | HTMLDivElement |     |
| `divClass` | string |     |
| `isSecondary` | boolean |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1052]

#### (async) getSummonerInfo(server, puuid)

API call to retrieve summoner info (summoner id,summoner level, profile icon ID) based on puuid and server

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `server` | string |     |
| `puuid` | string |     |

Source:

*   [src/pages/App.jsx], [line 471]

##### Returns:

#### (async) getSummonerItemImage(summonerItemData, itemID, baseImageURL) → {HTMLImageElement}

Queries JSON data to get URL for the icon path of a specific item. API call is sent to that URL and a HTMLImageElement is returned with that image on it

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerItemData` | JSON |     |
| `itemID` | number |     |
| `baseImageURL` | string |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1140]

##### Returns:

Type

HTMLImageElement

#### (async) getSummonerRuneAssets(mainRuneID, secondaryRuneID, divClass, component)

Driver method to get rune image files and make HTMLImageElement components

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `mainRuneID` | number |     |
| `secondaryRuneID` |     |     |
| `divClass` | string |     |
| `component` | HTMLDivElement |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1032]

#### (async) getSummonerSpellAssets(summoner1Id, summoner2Id)

Driver method that gets JSON data from a URL and uses it to get summoner image assets

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summoner1Id` | string |     |
| `summoner2Id` | string |     |

Source:

*   [src/pages/Dashboard.jsx], [line 963]

##### Returns:

#### (async) getSummonerSpellImage(summonerSpellsData, spellID, baseImageURL) → {HTMLImageElement}

Executes API call to get image data and return image component from it

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerSpellsData` | JSON |     |
| `spellID` | string |     |
| `baseImageURL` | string |     |

Source:

*   [src/pages/Dashboard.jsx], [line 997]

##### Returns:

Type

HTMLImageElement

#### getSummonerStats(tagLine, gameName, server, region) → {JSON}

Driver method that initiates all API calls

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tagLine` | string |     |
| `gameName` | string |     |
| `server` | string |     |
| `region` | string |     |

Source:

*   [src/pages/App.jsx], [line 392]

##### Returns:

Type

JSON

#### (async) loadVersion() → {Promise}

API call to Riot Data Dragon for retrieving latest patch version number

Source:

*   [src/pages/App.jsx], [line 274]

##### Returns:

Type

Promise

#### loadWinrate(gameQueue, winrateNumber)

Driver method to update games played and winrate percentage based on ranked game mode (solo, flex)

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `gameQueue` | number |     |
| `winrateNumber` | number |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1223]

#### makeApiCall(apiURL) → {Promise}

API call to Riot for data

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `apiURL` | string |     |

Source:

*   [src/pages/App.jsx], [line 429]

##### Returns:

Type

Promise

#### (async) makeChampionWinrate(summonerChampionWinrateInfo, championsInfo, queueId)

Function that displays champion winrate stats for a specific game queue based on champion mastery info

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerChampionWinrateInfo` |     |     |
| `championsInfo` |     |     |
| `queueId` | number |     |

Source:

*   [src/pages/Dashboard.jsx], [line 487]

#### makeMainRoleBadge(summonerMatchInfo)

Gathers most played position in ranked from summoner match info and displays it on badge

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerMatchInfo` |     |     |

Source:

*   [src/pages/Dashboard.jsx], [line 714]

##### Returns:

#### makeMillionBadge(summonerChampionWinrateInfo, championsInfo)

Iterates first couple champions on their mastery info to determine which ones have a million plus mastery points and then displays it on badge

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerChampionWinrateInfo` |     |     |
| `championsInfo` | Map.<number, string> |     |

Source:

*   [src/pages/Dashboard.jsx], [line 757]

##### Returns:

#### makeMostPlayedBadge(summonerChampionWinrateInfo, championsInfo)

Scans games played on all champs in all modes to determine the top champion with the most games played and then displays it on a badge

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerChampionWinrateInfo` |     |     |
| `championsInfo` | Map.<number, string> |     |

Source:

*   [src/pages/Dashboard.jsx], [line 815]

##### Returns:

#### (async) makeProfileIcon(summonerInfo)

API call to retrieve the profile icon image and then display it on profile

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerInfo` |     |     |

Source:

*   [src/pages/Dashboard.jsx], [line 882]

#### makeStreakBadge(summonerMatchInfo)

Scans games until the win outcome changes to determine if a player is on a winning streak or a losing streak and displays it on a badge

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerMatchInfo` |     |     |

Source:

*   [src/pages/Dashboard.jsx], [line 850]

##### Returns:

#### makeSummonerBadges(summonerMatchInfo, summonerChampionWinrateInfo, championsInfo)

Driver method to display badges on profile block that represent key information about the player and his performance

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerMatchInfo` |     |     |
| `summonerChampionWinrateInfo` |     |     |
| `championsInfo` | Map.<number, string> |     |

Source:

*   [src/pages/Dashboard.jsx], [line 687]

#### (async) makeSummonerProfile(summonerInfo, summonerRankedInfo, summonerMatchInfo, summonerChampionWinrateInfo, championsInfo)

Driver method to build the main summoner profile block with info regarding ranked mode and their gameplay

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `summonerInfo` |     |     |
| `summonerRankedInfo` |     |     |
| `summonerMatchInfo` |     |     |
| `summonerChampionWinrateInfo` |     |     |
| `championsInfo` | Map.<number, string> |     |

Source:

*   [src/pages/Dashboard.jsx], [line 662]

#### matchInfoListDriver(region, puuid)

API call to retrieve all match information from a matchID

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `region` |     |     |
| `puuid` | string |     |

Source:

*   [src/pages/App.jsx], [line 648]

##### Returns:

#### updateProgressBar(elementId, value, text)

Button method to change winrate and games played value on the circular progress bars

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `elementId` | string |     |
| `value` | number |     |
| `text` | string |     |

Source:

*   [src/pages/Dashboard.jsx], [line 1244]

## [Home]

### Global

*   [apiGETDatabaseCall]
*   [apiImageCall]
*   [apiPOSTDatabaseCall]
*   [apiPUTDatabaseCall]
*   [apiProxyCall]
*   [checkIfOwnPlayer]
*   [findMoreMatches]
*   [formatDateSQL]
*   [getAllChampions]
*   [getChampionWinrate]
*   [getInput]
*   [getItemAssets]
*   [getMasteryInfo]
*   [getMatchList]
*   [getOtherPlayerAssets]
*   [getPUUID]
*   [getRankedInfo]
*   [getRuneImage]
*   [getSummonerInfo]
*   [getSummonerItemImage]
*   [getSummonerRuneAssets]
*   [getSummonerSpellAssets]
*   [getSummonerSpellImage]
*   [getSummonerStats]
*   [loadVersion]
*   [loadWinrate]
*   [makeApiCall]
*   [makeChampionWinrate]
*   [makeMainRoleBadge]
*   [makeMillionBadge]
*   [makeMostPlayedBadge]
*   [makeProfileIcon]
*   [makeStreakBadge]
*   [makeSummonerBadges]
*   [makeSummonerProfile]
*   [matchInfoListDriver]
*   [updateProgressBar]

  

Documentation generated by [JSDoc 4.0.3] on Sun Sep 29 2024 12:21:28 GMT+0300 (Eastern European Summer Time)

prettyPrint();

[server/controller/apiService.js]: server_controller_apiService.js.html
[line 103]: server_controller_apiService.js.html#line103
[server/controller/apiService.js]: server_controller_apiService.js.html
[line 37]: server_controller_apiService.js.html#line37
[server/controller/apiService.js]: server_controller_apiService.js.html
[line 66]: server_controller_apiService.js.html#line66
[server/controller/apiService.js]: server_controller_apiService.js.html
[line 133]: server_controller_apiService.js.html#line133
[server/controller/apiService.js]: server_controller_apiService.js.html
[line 8]: server_controller_apiService.js.html#line8
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1199]: src_pages_Dashboard.jsx.html#line1199
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 776]: src_pages_App.jsx.html#line776
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 823]: src_pages_App.jsx.html#line823
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 301]: src_pages_App.jsx.html#line301
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 552]: src_pages_App.jsx.html#line552
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 317]: src_pages_App.jsx.html#line317
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1095]: src_pages_Dashboard.jsx.html#line1095
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 494]: src_pages_App.jsx.html#line494
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 589]: src_pages_App.jsx.html#line589
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1170]: src_pages_Dashboard.jsx.html#line1170
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 457]: src_pages_App.jsx.html#line457
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 791]: src_pages_App.jsx.html#line791
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1052]: src_pages_Dashboard.jsx.html#line1052
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 471]: src_pages_App.jsx.html#line471
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1140]: src_pages_Dashboard.jsx.html#line1140
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1032]: src_pages_Dashboard.jsx.html#line1032
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 963]: src_pages_Dashboard.jsx.html#line963
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 997]: src_pages_Dashboard.jsx.html#line997
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 392]: src_pages_App.jsx.html#line392
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 274]: src_pages_App.jsx.html#line274
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1223]: src_pages_Dashboard.jsx.html#line1223
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 429]: src_pages_App.jsx.html#line429
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 487]: src_pages_Dashboard.jsx.html#line487
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 714]: src_pages_Dashboard.jsx.html#line714
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 757]: src_pages_Dashboard.jsx.html#line757
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 815]: src_pages_Dashboard.jsx.html#line815
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 882]: src_pages_Dashboard.jsx.html#line882
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 850]: src_pages_Dashboard.jsx.html#line850
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 687]: src_pages_Dashboard.jsx.html#line687
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 662]: src_pages_Dashboard.jsx.html#line662
[src/pages/App.jsx]: src_pages_App.jsx.html
[line 648]: src_pages_App.jsx.html#line648
[src/pages/Dashboard.jsx]: src_pages_Dashboard.jsx.html
[line 1244]: src_pages_Dashboard.jsx.html#line1244
[Home]: index.html
[apiGETDatabaseCall]: global.html#apiGETDatabaseCall
[apiImageCall]: global.html#apiImageCall
[apiPOSTDatabaseCall]: global.html#apiPOSTDatabaseCall
[apiPUTDatabaseCall]: global.html#apiPUTDatabaseCall
[apiProxyCall]: global.html#apiProxyCall
[checkIfOwnPlayer]: global.html#checkIfOwnPlayer
[findMoreMatches]: global.html#findMoreMatches
[formatDateSQL]: global.html#formatDateSQL
[getAllChampions]: global.html#getAllChampions
[getChampionWinrate]: global.html#getChampionWinrate
[getInput]: global.html#getInput
[getItemAssets]: global.html#getItemAssets
[getMasteryInfo]: global.html#getMasteryInfo
[getMatchList]: global.html#getMatchList
[getOtherPlayerAssets]: global.html#getOtherPlayerAssets
[getPUUID]: global.html#getPUUID
[getRankedInfo]: global.html#getRankedInfo
[getRuneImage]: global.html#getRuneImage
[getSummonerInfo]: global.html#getSummonerInfo
[getSummonerItemImage]: global.html#getSummonerItemImage
[getSummonerRuneAssets]: global.html#getSummonerRuneAssets
[getSummonerSpellAssets]: global.html#getSummonerSpellAssets
[getSummonerSpellImage]: global.html#getSummonerSpellImage
[getSummonerStats]: global.html#getSummonerStats
[loadVersion]: global.html#loadVersion
[loadWinrate]: global.html#loadWinrate
[makeApiCall]: global.html#makeApiCall
[makeChampionWinrate]: global.html#makeChampionWinrate
[makeMainRoleBadge]: global.html#makeMainRoleBadge
[makeMillionBadge]: global.html#makeMillionBadge
[makeMostPlayedBadge]: global.html#makeMostPlayedBadge
[makeProfileIcon]: global.html#makeProfileIcon
[makeStreakBadge]: global.html#makeStreakBadge
[makeSummonerBadges]: global.html#makeSummonerBadges
[makeSummonerProfile]: global.html#makeSummonerProfile
[matchInfoListDriver]: global.html#matchInfoListDriver
[updateProgressBar]: global.html#updateProgressBar
[JSDoc 4.0.3]: https://github.com/jsdoc/jsdoc