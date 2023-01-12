import {
  Stack,
  StackProps,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_s3_deployment as s3_deployment,
  RemovalPolicy,
  aws_cloudfront_origins,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class ArcturusStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "arcturus-source", {
      bucketName: "arcturus-source",
      accessControl: s3.BucketAccessControl.PUBLIC_READ,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(
      this,
      "arcturus-distribution",
      {
        defaultBehavior: {
          origin: new aws_cloudfront_origins.S3Origin(bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
      }
    );

    new s3_deployment.BucketDeployment(this, "arcturus-deployment", {
      sources: [s3_deployment.Source.asset("../frontend")],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
