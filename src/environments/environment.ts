// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bucketUrlPath: 'https://kaleidoscope-media.s3.us-east-1.amazonaws.com/',
  awsRegion: 'us-east-1',
  awsBucket: 'kaleidoscope-media',
  //these aws credentials are for RO S3 access. Meaning, it matters 0% if someone skims this as far as i am concerned.
  awsAccessKey: 'AKIA6AVV5VSCJOMOZI5J',
  awsSecretKey: '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'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
