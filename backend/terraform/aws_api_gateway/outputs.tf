output "api-gateway-arn" {
  description = "ARN of the API Gateway which has been deployed."
  value       = aws_api_gateway_rest_api.api.execution_arn
}
