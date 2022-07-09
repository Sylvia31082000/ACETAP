
# To configure the root "REST API" object.
resource "aws_api_gateway_rest_api" "api" {
  name = var.name
  body = var.body

  endpoint_configuration {
    types = [var.endpoint_configuration_type]
  }
}

# API GATEWAY (Deployment of individual stages)
resource "aws_api_gateway_stage" "env_stage" {
  depends_on = [
    aws_api_gateway_rest_api.api
  ]

  rest_api_id         = aws_api_gateway_rest_api.api.id
  stage_name          = var.stage_name
  deployment_id       = aws_api_gateway_deployment.api-stage-deployment.id
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.stage_access_log.arn
    format = "$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] \"$context.httpMethod $context.resourcePath $context.protocol\" $context.status $context.responseLength $context.requestId"
  }
}

# Deploys the stage of the API.
resource "aws_api_gateway_deployment" "api-stage-deployment" {
  depends_on = [
    aws_api_gateway_rest_api.api
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
  description = "Managed by Terraform"

  # The API stage will be re-deployed if any of the contents is changed.
  triggers = {
    redeployment = sha1(join(",", tolist([
      file(var.path_to_openapi),
      var.body
    ])
   ))
  }
}

# # Creates an API key with this name
# resource "aws_api_gateway_api_key" "api-key" {
#   name        = var.api_key_name
#   description = "(Managed by Terraform) The API key meant for the Admin Application APIs."
# }

# API GATEWAY (Usage Plan, limits)
# Sets up & configures the usage plan for the specified stage of the API
resource "aws_api_gateway_usage_plan" "api-usage-plan" {
  name        = var.api_usage_plan_name
  description = "The Admin Application Usage Plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.env_stage.stage_name
  }

  throttle_settings {
    burst_limit = var.api_usage_plan_rate
    rate_limit  = var.api_usage_plan_burst
  }
}

# # Provides a usage plan key to the API Gateway
# resource "aws_api_gateway_usage_plan_key" "api-usage-plan-key" {
#   key_id        = aws_api_gateway_api_key.api-key.id
#   key_type      = "API_KEY"
#   usage_plan_id = aws_api_gateway_usage_plan.api-usage-plan.id
# }

# API GATEWAY (Enable CloudWatch Logs)
resource "aws_api_gateway_account" "api-account" {
  cloudwatch_role_arn = aws_iam_role.api-cloudwatch.arn
}

resource "aws_iam_role" "api-cloudwatch" {
  name = "${var.name}-cloudwatch-${var.stage_name}-roles"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy" "api-cloudwatch" {
  name = "${var.name}-cloudwatch-${var.stage_name}-policys"
  role = aws_iam_role.api-cloudwatch.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_api_gateway_method_settings" "api-cloudwatch-logs" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.env_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled    = true
    logging_level      = var.cloudwatch_logging_level
    data_trace_enabled = var.cloudwatch_data_trace_enabled

    # Limit the rate of calls to prevent abuse and unwanted charges
    throttling_rate_limit  = var.api_usage_plan_rate
    throttling_burst_limit = var.api_usage_plan_burst
  }
}

resource "aws_cloudwatch_log_group" "stage_access_log" {
  name = "${var.name}-${var.stage_name}-api-access-log"
}
