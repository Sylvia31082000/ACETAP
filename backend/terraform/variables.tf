variable "api_gateway_cloudwatch_logging_level" {
  description = "Specifies the logging level for this method, which effects the log entries pushed to Amazon CloudWatch Logs."
  type        = string
  default     = "ERROR"
}

variable "api_gateway_cloudwatch_data_trace_enabled" {
  description = "Specifies whether data trace logging is enabled for this method, which effects the log entries pushed to Amazon CloudWatch Logs."
  type        = bool
  default     = true
}

variable "api_gateway_path_to_openapi_security_definition" {
  description = "Pathway to the security definition file"
  type        = string
  default     = "./api_specs/security.json"
}