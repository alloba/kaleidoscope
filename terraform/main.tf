terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "alloba-terraform-state-files"
    key = "kaleidoscope"
    region = "us-east-1"
  }
}

provider "aws" {
  default_tags {
    tags = {
      project = "kaleidoscope"
      managedBy = "Terraform"
      environment = terraform.workspace
    }
  }
  region = "us-east-1"
}

# TODO would prefer a centralized module.
module "kaleidoscope-site" {
  source = "./cloudfront-s3-site"
  acm_certificate_domain = "alexlbates.com"
  cloudfront_distribution_description = "Kaleidoscope Site"
  route_53_record_names = ["kaleidoscope.alexlbates.com"]
  route_53_zone_name = "alexlbates.com"
  s3_bucket_name = "kaleidoscope.alexlbates.com"
}
