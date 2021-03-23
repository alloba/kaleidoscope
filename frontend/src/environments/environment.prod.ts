export const environment = {
  production: true,
  ImageServiceEndpoint: 'http://kaleidoscope-combined.us-east-1.elasticbeanstalk.com/',
  awsRegion: 'us-east-1',
  awsBucket: 'kaleidoscope-media',
  //these aws credentials are for RO S3 access. Meaning, it matters 0% if someone skims this as far as i am concerned.
  awsAccessKey: 'REMOVED-ACCESS-KEY',
  awsSecretKey: 'REMOVED-SECRET-KEY'
};
