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
}

async function performDelete(params) {
    try {
        // To retrieve all items
        const scanResults = [];
        var items;
        do {
            items =  await docClient.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey  = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey !== "undefined");

        
        var itemsToDelete = []
        for (var obj of scanResults) {
            itemsToDelete.push({
                DeleteRequest: {
                    Key: { "teamName": obj.teamName }
                }
            })
            
        }
    
        var deleteParams = {
            RequestItems: {
            }
        };
        deleteParams.RequestItems[process.env.TEAM_TABLE_NAME] = itemsToDelete
        console.log(JSON.stringify(deleteParams))

        let response = {
            "statusCode": 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            "body": "Teams information has been cleared successfully.",
        }

        // To perform a batch write for deletion
        if (itemsToDelete.length > 0) {
            let item = docClient.batchWrite(deleteParams).promise()

            item.then(res => {
                return response
            })
        } else {
            return response
        }

        
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