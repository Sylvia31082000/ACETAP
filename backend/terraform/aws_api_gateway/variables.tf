variable "name" {
  description = "The name of the API Gateway."
  type        = string
}

variable "body" {
  description = "The OpenAPI definition of this API Gateway. Use the templatefile(...) function to interpolate the correct lambda function ARNs to the approproate AWS endpoint integrations."
  type        = string
}

variable "stage_name" {
  description = "The name of the environment stage that this API will be deployed to."
  type        = string
}

variable "path_to_openapi" {
  description = "Path to the OpenAPI / Swagger API definition file."
  type        = string
}

variable "cloudwatch_logging_level" {
  description = "Specifies the logging level for this method, which effects the log entries pushed to Amazon CloudWatch Logs."
  type        = string
}

variable "cloudwatch_data_trace_enabled" {
  description = "Specifies whether data trace logging is enabled for this method, which effects the log entries pushed to Amazon CloudWatch Logs."
  type        = bool
}

variable "data_table" {
  description = "The list of tables ARN accessed by aws lambda."
  type        = list(string)
}

variable "api_usage_plan_name" {
  description = "The name of the API Gateway's Usage Plan."
  type        = string
}

variable "api_usage_plan_rate" {
  description = "The throttling rate limit of the API Gateway."
  type        = string
}

variable "api_usage_plan_burst" {
  description = "The throttling burst limit of the API Gateway."
  type        = string
}

variable "endpoint_configuration_type" {
  description = "The allowed endpoint type. This resource currently only supports managing a single value. Valid values: EDGE, REGIONAL or PRIVATE. If unspecified, defaults to EDGE."
  type        = string
}

