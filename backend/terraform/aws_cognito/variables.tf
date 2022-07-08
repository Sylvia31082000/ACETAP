variable "name" {
  description = "The name of the Cognito User Pool (displayed on the AWS Management Console)."
  type        = string
}

variable "user_pool_client_app_name" {
  description = "The name of the Cognito User Pool App Client"
  type        = string
}