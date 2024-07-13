data aws_acm_certificate "acm_certificate" {
  domain = var.acm_certificate_domain
  statuses = ["ISSUED"]
}

data aws_route53_zone "target_zone" {
  name = var.route_53_zone_name
  private_zone = false
}
