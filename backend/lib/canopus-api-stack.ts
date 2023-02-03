import {
  Stack,
  StackProps,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_lambda_nodejs as nodejs_lambda,
  aws_lambda as lambda,
  aws_logs as logs,
  RemovalPolicy,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CanopusApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createGatewayAPI();
  }

  createGatewayAPI = () => {
    const libraryLayer = new lambda.LayerVersion(this, "Canopus_LibraryLayer", {
      code: lambda.Code.fromAsset("./src/library"),
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_16_X,
        lambda.Runtime.NODEJS_18_X,
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const lambdaPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:BatchGetItem",
        "dynamodb:ConditionCheckItem",
      ],
      resources: ["*"],
    });

    const lambdaBackend = new nodejs_lambda.NodejsFunction(
      this,
      "Canopus_API_Resolver",
      {
        functionName: "Canopus_API_Resolver",
        entry: "src/api-lambda/main.ts",
        handler: "handler",
        layers: [libraryLayer],
        bundling: {
          minify: true,
        },
        runtime: lambda.Runtime.NODEJS_16_X,
        memorySize: 512,
        timeout: Duration.seconds(30),
        logRetention: logs.RetentionDays.ONE_WEEK,
        initialPolicy: [lambdaPolicy],
      }
    );

    const apiPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
          actions: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ],
          resources: ["*Canopus*"],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          principals: [new iam.AnyPrincipal()],
          actions: ["execute-api:Invoke"],
          resources: ["*"],
        }),
      ],
    });

    const api = new apigateway.LambdaRestApi(this, "Canopus_API", {
      handler: lambdaBackend,
      proxy: false,
      integrationOptions: {
        timeout: Duration.seconds(15),
      },
      deployOptions: {
        stageName: process.env.STAGE_NAME || "dev",
      },
      policy: apiPolicy,
      cloudWatchRole: true, // https://github.com/aws/aws-cdk/issues/10878
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const servicesResource = api.root.addResource("services");
    servicesResource.addMethod("GET");

    const serviceDataResource = api.root.addResource("service-actions-data");
    serviceDataResource.addMethod("GET");
  };
}
