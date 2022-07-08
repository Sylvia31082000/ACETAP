# To configure the lambda function resource.
resource "aws_lambda_function" "lambda" {
    function_name    = "${var.name}-function"
    handler          = "index.handler"
    runtime          = "nodejs12.x"
    timeout          = var.timeout
    memory_size      = var.memory_size
    filename         = data.archive_file.lambda-zip.output_path
    source_code_hash = data.archive_file.lambda-zip.output_base64sha256
    role             = aws_iam_role.iam-role.arn

    environment {
    variables = merge({
      NODE_OPTIONS = "--enable-source-maps"
    }, var.env_vars)
  }
}

#  Used to create the zip file.
data "archive_file" "lambda-zip" {
  type        = "zip"
  source_file = "${var.file_path}/index.js"
  output_path = "${var.file_path}/index.zip"
}

# AWS IAM ROLE
resource "aws_iam_role" "iam-role" {
    name = "${var.name}-auth-iam-role"

    assume_role_policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  }
  EOF
}

resource "aws_iam_role_policy" "iam-role-policy" {
  name   = "${var.name}-auth-role-policy"
  role   = aws_iam_role.iam-role.id
  policy = var.iam_role_policy
}

# IAM Policy to allow this lambda to write to Amazon Cloudwatch Logs
resource "aws_iam_role_policy" "iam-role-policy-cloudwatch" {
  name   = "${var.name}-role-policy-cloudwatch"
  role   = aws_iam_role.iam-role.id
  policy = data.aws_iam_policy_document.iam-role-policy-cloudwatch-document.json
}

# IAM Policy for writing to AWS Cloudwatch Logs
# Uses the default AWS provider's CloudWatch Logs Policy sample for lambda functions
data "aws_iam_policy_document" "iam-role-policy-cloudwatch-document" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:CreateLogGroup",
      "logs:PutLogEvents"
    ]

    resources = [
      "arn:aws:logs:*:*:*"
    ]
  }
}

# AWS LAMBDA PERMISSIONS
# Permission to allow the corresponding endpoint on AWS API Gateway to invoke this lambda function
resource "aws_lambda_permission" "permission-invoke-lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.lambda.arn
}
