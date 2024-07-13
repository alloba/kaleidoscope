variable "acm_certificate_domain" {
  type = string
  description = "Domain name of the acm cert to use for the cloudfront distribution. Probably matches the route_53_zone_name."
}

variable "route_53_zone_name" {
  type = string
  description = "The name of the route53 hosted zone. Something like 'alexlbates.com'."
}

variable "route_53_private_zone" {
  type = bool
  description = "Whether the target r53 is private or not. Generally should be public for generic website access."
  default = false
}

variable "route_53_record_names" {
  type = set(string)
  description = "List of records to create for the site. Something like (www, '') for root level."
}
