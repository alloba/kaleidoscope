resource "aws_route53_record" "primary-website-record" {
  for_each = var.route_53_record_names

  name            = each.value
  zone_id         = data.aws_route53_zone.target_zone.id
  type            = "A"

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.website-routing.domain_name
    zone_id                = aws_cloudfront_distribution.website-routing.hosted_zone_id
  }
}
