
# Create team data
module "lambda_create_score" {
    source = "./aws_lambda"
    name = "createScore"
    file_path = "../src/functions/Score/createScore"
    iam_role_policy = <<-EOF
    {
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "dynamodb:PutItem",
            "dynamodb:BatchWriteItem",
            "dynamodb:TransactWriteItems",
            "dynamodb:UpdateItem"
            ],
            "Resource": "${local.team_table_arn}"
        }
        ]
    }
    EOF
    data_table = local.lambda_data_table_arns
    env_vars = {
        ENV                         = local.lambda_env
        TEAM_TABLE_NAME             = local.team_table_name
        METHOD                      = "score/createScore"
    }
}

# Retrieve score data
module "lambda_get_score" {
    source = "./aws_lambda"
    name = "getScore"
    file_path = "../src/functions/Score/getScore"
    iam_role_policy = <<-EOF
    {
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "dynamodb:Scan"
            ],
            "Resource": "${local.team_table_arn}"
        }
        ]
    }
    EOF
    data_table = local.lambda_data_table_arns
    env_vars = {
        ENV                         = local.lambda_env
        TEAM_TABLE_NAME             = local.team_table_name
        METHOD                      = "score/getScore"
    }
}