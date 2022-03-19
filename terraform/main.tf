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
}
