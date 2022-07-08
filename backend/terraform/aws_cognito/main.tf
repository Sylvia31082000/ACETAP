# To configure Cognito User Pool resource.
resource "aws_cognito_user_pool" "user_pool" {
  name = var.name
  username_attributes = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only = true
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "admindomain"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}


resource "aws_cognito_user_pool_client" "user_pool_client" {
  user_pool_id = aws_cognito_user_pool.user_pool.id
  name         = var.user_pool_client_app_name
  supported_identity_providers = ["COGNITO"]
  allowed_oauth_scopes = ["email", "openid"]
  allowed_oauth_flows = ["code"]

  callback_urls = ["http://localhost"]
  logout_urls = ["http://localhost"]

  generate_secret = false
  refresh_token_validity               = 60
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_CUSTOM_AUTH"
  ]
}

resource "aws_cognito_resource_server" "resource" {
  identifier = "admin"
  name       = "admin"

  scope {
    scope_name        = "secure"
    scope_description = "All secured resources"
  }

  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "admin-auth-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.user_pool_client.id
    provider_name           = "cognito-idp.ap-southeast-1.amazonaws.com/${aws_cognito_user_pool.user_pool.id}"
    server_side_token_check = false
  }
}