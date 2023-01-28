import {
  Stack,
  StackProps,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_s3_deployment as s3_deployment,
  aws_certificatemanager as certificatemanager,
  aws_iam as iam,
  RemovalPolicy,
  aws_cloudfront_origins,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";

const domainName = "iamgenerator.com";
// const certificate = "";

export class ArcturusStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "arcturus-source", {
      bucketName: "arcturus-source",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      // blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // create CF user to give S3 access to CloudFront distribution
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI"
    );

    const cloudfrontReadS3Access = new iam.PolicyStatement({
      actions: ["s3:*"],
      resources: [bucket.arnForObjects("*")],
      principals: [
        new iam.CanonicalUserPrincipal(
          cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
    });
    bucket.addToResourcePolicy(cloudfrontReadS3Access);

    const distribution = new cloudfront.Distribution(
      this,
      "arcturus-distribution",
      {
        defaultBehavior: {
          origin: new aws_cloudfront_origins.S3Origin(bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: "/error.html",
            ttl: Duration.minutes(30),
          },
        ],
        // domainNames: [domainName, `www.${domainName}`],
        // certificate: certificatemanager.Certificate.fromCertificateArn(
        //   this,
        //   "Arcturus-Cloudfront",
        //   certificate
        // ),
        // sslSupportMethod: cloudfront.SSLMethod.SNI,
      }
    );

    new s3_deployment.BucketDeployment(this, "arcturus-deployment", {
      sources: [s3_deployment.Source.asset("../frontend")],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
