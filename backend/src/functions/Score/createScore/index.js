var AWS = require('aws-sdk')
AWS.config.update({region: 'ap-southeast-1'})
var docClient = new AWS.DynamoDB.DocumentClient();
var teams

exports.handler =  function(event, context, callback) {

    let body = JSON.parse(event.body)
    teams = {}

    // To split every line
    let arr = body.text.split("\n")

    console.log(JSON.stringify(arr))

    for (var item of arr) {
        if (item != "") {
            updateTable(item)
        }
    }
    console.log(JSON.stringify(teams))

    var updateItems = []
    for (var key in teams) {
        var updateItem = {
            Update: {
                TableName: process.env.TEAM_TABLE_NAME,
                Key: {
                    "teamName": key
                },
                UpdateExpression: "set score = :score, goals = :goals, alternateScore = :alternateScore",
                ExpressionAttributeValues: {
                    ":score": teams[key].score,
                    ":alternateScore": teams[key].alternateScore,
                    ":goals": teams[key].goals
                }
            }
        }
        updateItems.push(updateItem)
    }

    console.log(JSON.stringify(updateItems))

    
      try {
        // Perform transactions to ensure that all updates occur successfully
        let item = docClient.transactWrite({TransactItems: updateItems}).promise()

        item.then(res => {
            let object = {
                message: "Scores updated successfully."
            }
            let response = {
                "statusCode": 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                "body": JSON.stringify(object),
            }
            callback(null, response)
        })
    } catch (error) {
        console.log("ERR" + error)
        let object = {
            message: "An error while updating the scores, please try again later."
        }
        let response = {
            "statusCode": 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            "body": JSON.stringify(object),
        }
        callback(null, response)
    }
}

// Update the current state of the teams based on each match taken in as an item parameter
updateTable = function(item) {
    var arr = item.split(" ")
    var firstTeam = arr[0]
    var secTeam = arr[1]
    var firstScore = arr[2]
    var secScore = arr[3]

    var firstWin = firstScore > secScore
    var draw = firstScore == secScore

    updateTeam(firstTeam, firstScore, firstWin, draw)
    updateTeam(secTeam, secScore, !firstWin, draw)
}

// Update the relevant scores
updateTeam = function(teamName, goals, win, draw) {
    if (!teams.hasOwnProperty(teamName)) {
        teams[teamName] = {
            "goals": 0,
            "score": 0,
            "alternateScore": 0
        }
    }
    
    teams[teamName].goals = teams[teamName].goals + Number(goals)

    if (draw) {
        teams[teamName].score = teams[teamName].score + 1
        teams[teamName].alternateScore = teams[teamName].alternateScore + 3
    } else {
        if (win) {
            teams[teamName].score = teams[teamName].score + 3
            teams[teamName].alternateScore = teams[teamName].alternateScore + 5
        } else {
            teams[teamName].alternateScore = teams[teamName].alternateScore + 1
        }
    }
    
}