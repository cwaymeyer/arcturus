import {
  Stack,
  StackProps,
  aws_dynamodb as dynamodb,
  aws_ecs as ecs,
  aws_events as events,
  aws_events_targets as eventstargets,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_lambda_nodejs as nodejs_lambda,
  aws_lambda as lambda,
  aws_logs as logs,
  RemovalPolicy,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CanopusStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Canopus_Data", {
      tableName: "Canopus_Data",
      partitionKey: { name: "service", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // ECS Fargate
    const cluster = new ecs.Cluster(this, "Canopus_Cluster");

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "Canopus_TaskDefinition"
    );

    taskDefinition.addContainer("Canopus_Container", {
      image: ecs.ContainerImage.fromAsset("../canopus/src"),
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "Canopus",
      }),
    });

    taskDefinition.addToTaskRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [table.tableArn],
        actions: ["dynamodb:*"],
      })
    );

    const task = new eventstargets.EcsTask({ cluster, taskDefinition });

    const schedule = new events.Rule(this, "Canopus_Rule", {
      schedule: events.Schedule.expression("cron(00 21 1 * ? *)"),
    });

    schedule.addTarget(task);

    const libraryLayer = new lambda.LayerVersion(this, "Canopus_LibraryLayer", {
      code: lambda.Code.fromAsset("./src/library"),
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_16_X,
        lambda.Runtime.NODEJS_18_X,
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // API for frontend access
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
      }
    );

    const canopusLogs = new logs.LogGroup(this, "Canopus_Logs", {
      logGroupName: "Canopus_Logs",
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    const apiLogPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
          resources: ["*Canopus*"],
          actions: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ],
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
        // accessLogDestination: new apigateway.LogGroupLogDestination(
        //   canopusLogs
        // ),
        // accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
      policy: apiLogPolicy,
      cloudWatchRole: true, // https://github.com/aws/aws-cdk/issues/10878
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        // allowOrigins: ["<url>"],
      },
    });

    const services = api.root.addResource("services");
    services.addMethod("GET");
  }
}
