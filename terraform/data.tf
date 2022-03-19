data "aws_route53_zone" "primary-domain" {
  name = "alexlbates.com"
  private_zone = false
}
