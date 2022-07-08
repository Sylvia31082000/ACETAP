var AWS = require('aws-sdk')
AWS.config.update({region: 'ap-southeast-1'})
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback) {

    let body = JSON.parse(event.body)
    
    var params = {
        TableName : process.env.TEAM_TABLE_NAME,
      }

      get(params).then(res => {
          console.log(JSON.parse(res.body))
          callback(null, res)
      })
}

async function get(params) {
    try {
        const scanResults = [];
        var items;
        do {
            items =  await docClient.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey  = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey !== "undefined");

        console.log(JSON.stringify(scanResults))
        
        // return scanResults;
        // let item = await docClient.scan(params).promise()
        let response = {
            "statusCode": 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            "body": JSON.stringify(scanResults),
        }
        return response
    } catch (error) {
        let object = {
            message: "An error occurred, please try again later."
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