terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  backend "s3" {
    bucket = "s3-ace-bucket-terraform"
    key = "terraform.tfstate"
    region = "ap-southeast-1"
  }
}

provider "aws" {
   region = local.region
}

locals {
    region  = "ap-southeast-1"
    env     = lower(terraform.workspace)
    project = "football-api"

    # a list of supported environment & Terraform workspace labels. Each of these labels
    # also corresponds to each Terraform workspace label and should match each one exactly.
    env_dev_label = "dev"

    # Basic Settings
    api_gateway_name                   = "${local.project}"
    api_gateway_name_prefix            = "${local.project}-${local.env}"
    api_gateway_authorizer_name_prefix = local.api_gateway_name
    api_gateway_path_to_openapi        = "./api_specs/api.json"

    # Standard API Key
    api_gateway_security_definition_method_api = "${local.api_gateway_authorizer_name_prefix}-key"

    cognito_user_pool_name = "admin-user-pool"
    cognito_user_pool_client_app_name = "admin-user-pool-app-client"

    lambda_data_table_arns = [
        "arn:aws:dynamodb:ap-southeast-1:176612440753:table/football-team-table"  
    ]

    lambda_user_pool_arns = [
        module.user_pool.aws_cognito_user_pool_arn
    ]

    api_gateway_type = "REGIONAL"

    # Environment Variables
    lambda_env = local.env

    # TEAM TABLE
    team_table_arn = "arn:aws:dynamodb:ap-southeast-1:176612440753:table/football-team-table"
    team_table_name = "football-team-table"

}
