
# Create team data
module "lambda_create_team" {
    source = "./aws_lambda"
    name = "createTeam"
    file_path = "../src/functions/Team/createTeam"
    iam_role_policy = <<-EOF
    {
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "dynamodb:PutItem",
            "dynamodb:BatchWriteItem"
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
        METHOD                      = "team/createTeam"
    }
}


# Delete team data
module "lambda_delete_team" {
    source = "./aws_lambda"
    name = "deleteTeam"
    file_path = "../src/functions/Team/deleteTeams"
    iam_role_policy = <<-EOF
    {
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "dynamodb:Scan",
            "dynamodb:BatchWriteItem"
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
        METHOD                      = "team/deleteTeams"
    }
}
