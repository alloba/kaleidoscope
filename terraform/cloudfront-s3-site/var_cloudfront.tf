variable "cloudfront_distribution_description" {
  type = string
  description = "Description to apply to the CF Distribution for easy reference."
}

variable "cloudfront_distribution_enabled" {
  type = bool
  description = "On/Off the distribution."
  default = true
}

variable "cloudfront_distribution_default_root_object" {
  type = string
  description = "Default route target for distribution. Like a landing page/homepage. 'index.html' default."
  default = "index.html"
}

variable "cloudfront_distribution_price_class" {
  type = string
  description = "Price class for distribution. PLEASE do not set this to something different."
  default = "PriceClass_100"
}

#variable "cloudfront_aliases" {
#  type = list(string)
#  description = "List of aliases to use for the distribution. This is www routing to me. www.alexlbates.com, alexlbates.com"
#}