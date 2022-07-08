module "user_pool" {
    source  = "./aws_cognito"
    name    = local.cognito_user_pool_name
    user_pool_client_app_name = local.cognito_user_pool_client_app_name
}