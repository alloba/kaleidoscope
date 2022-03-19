resource "aws_route53_record" "primary-website-record" {
  name    = "kaleidoscope" # kaleidoscope.alexlbates.com
  type    = "A"
  zone_id = data.aws_route53_zone.primary-domain.id

  alias {
    name                   = aws_s3_bucket.website-bucket.website_endpoint
    zone_id                = aws_s3_bucket.website-bucket.hosted_zone_id
    evaluate_target_health = true
  }
}
