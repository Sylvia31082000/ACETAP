output "aws_cognito_user_pool_arn" {
  description = "ARN of the Cognito user pool which has been deployed."
  value       = aws_cognito_user_pool.user_pool.arn
}
