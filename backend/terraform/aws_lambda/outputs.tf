output "aws_lambda_arn" {
  description = "ARN of the lambda function which has been deployed."
  value       = aws_lambda_function.lambda.arn
}

output "aws_lambda_invoke_arn" {
  description = " The ARN to be used for invoking Lambda Function from API Gateway. To be used in aws_api_gateway_integration's (or x-amazon-apigateway-integration OpenAPI / Swagger definition filter) URI."
  value       = aws_lambda_function.lambda.invoke_arn
}