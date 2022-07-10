var AWS = require('aws-sdk')
AWS.config.update({region: 'ap-southeast-1'})
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

exports.handler =  function(event, context, callback) {

    let body = JSON.parse(event.body)
    console.log("HELLO"+ body.text)

    // To split every line
    let arr = body.text.split("\n")
    var arrItems = []

    console.log(JSON.stringify(arr))

    for (var item of arr) {
        if (item != "") {
            var splitArr = item.split(" ")
            var teamNum = Number(splitArr[2])

            var itemToPut = {
                PutRequest: {
                    Item: {
                        "teamNumber": teamNum,
                        "teamName": splitArr[0],
                        "registrationDate": splitArr[1]
                    }
                }
            }
            console.log(JSON.stringify(itemToPut))
            arrItems.push(itemToPut)
        }
    }

    var params = {
        RequestItems: {
        }
    };
    params.RequestItems[process.env.TEAM_TABLE_NAME] = arrItems
    console.log(JSON.stringify(params))

    
      try {
        // To perform a batch insertion into the DynamoDB table
        let item = docClient.batchWrite(params).promise()
        
        item.then(res => {
            let object = {
                message: "Teams registered successfully."
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
        let object = {
            message: "An error occurred while registering for teams, please try again later."
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