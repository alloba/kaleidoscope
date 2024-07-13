resource "aws_cloudfront_distribution" "website-routing" {
  comment = var.cloudfront_distribution_description
  enabled = var.cloudfront_distribution_enabled
  aliases = var.route_53_record_names # TODO this probably doesn't work since the records are bare...
  default_root_object = var.cloudfront_distribution_default_root_object
  price_class = var.cloudfront_distribution_price_class

  # S3 destination
  origin {
    origin_id   = var.s3_bucket_name
    domain_name =  aws_s3_bucket_website_configuration.web_config.website_endpoint

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # s3 bucket websites work in HTTP only.
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default routing logic. When no other defined behaviors match, this one is used.
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.s3_bucket_name # referring to the origin defined above.

    viewer_protocol_policy = "redirect-to-https" # preserve ability to call the http url, but use https internally

    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 120

    forwarded_values {
      query_string = true
      headers = []
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations = ["US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn = data.aws_acm_certificate.acm_certificate.arn
    ssl_support_method = "sni-only" # DO NOT USE VIP. expensivo.
  }
}
