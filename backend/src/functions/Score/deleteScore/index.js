var AWS = require('aws-sdk')
AWS.config.update({region: 'ap-southeast-1'})
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback) {

    
    var params = {
        TableName: process.env.TEAM_TABLE_NAME,
      }

      performDelete(params).then(res => {
          callback(null, res)
      })


    async function performDelete(params) {
        try {
            // Retrieve all items in the database
            const scanResults = [];
            var items;
            do {
                items =  await docClient.scan(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
                params.ExclusiveStartKey  = items.LastEvaluatedKey;
            } while (typeof items.LastEvaluatedKey !== "undefined");
            
            var updateItems = []

            // Update each items with all the scores and goals set to 0
            for (var obj of scanResults) {
                var updateItem = {
                    Update: {
                        TableName: process.env.TEAM_TABLE_NAME,
                        Key: {
                            "teamName": obj.teamName
                        },
                        UpdateExpression: "set score = :score, goals = :goals, alternateScore = :alternateScore",
                        ExpressionAttributeValues: {
                            ":score": 0,
                            ":alternateScore": 0,
                            ":goals": 0
                        }
                    }
                }
                updateItems.push(updateItem)
            }

            console.log(JSON.stringify(updateItems))

            let response = {
                "statusCode": 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                "body": "Teams score information has been cleared successfully.",
            }

            let item = docClient.transactWrite({TransactItems: updateItems}).promise()

            item.then(res => {
                callback(null, response)
            })

            
        } catch (error) {
            console.log(error)
            let object = {
                message: "An error occurred while clearing teams information, please try again later."
            }
            let response = {
                "statusCode": 403,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                "body": JSON.stringify(object),
            }
            return response
        }
    }
}