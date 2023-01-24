import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import {
  Stack,
  StackProps,
  aws_dynamodb as dynamodb,
  aws_ecs as ecs,
  aws_events as events,
  aws_events_targets as eventstargets,
  aws_iam as iam,
  aws_appsync as appsync,
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

    const table = this.createDynamoTable();
    this.createFargateTask(table.tableArn);

    const graphqlEndpoints = ["getServices"];
    this.createGraphQLAPI(graphqlEndpoints);
  }

  createDynamoTable = () => {
    const table = new dynamodb.Table(this, "Canopus_Data", {
      tableName: "Canopus_Data",
      partitionKey: { name: "service", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return table;
  };

  createFargateTask = (tableArn: string) => {
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
        resources: [tableArn],
        actions: ["dynamodb:*"],
      })
    );

    const task = new eventstargets.EcsTask({ cluster, taskDefinition });

    const schedule = new events.Rule(this, "Canopus_Rule", {
      schedule: events.Schedule.expression("cron(00 21 1 * ? *)"),
    });

    schedule.addTarget(task);
  };

  createGraphQLAPI = (endpoints: string[]) => {
    const libraryLayer = new lambda.LayerVersion(this, "Canopus_LibraryLayer", {
      code: lambda.Code.fromAsset("./src/library"),
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_16_X,
        lambda.Runtime.NODEJS_18_X,
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const resolverLambda = new nodejs_lambda.NodejsFunction(
      this,
      "Canopus_API_Resolver",
      {
        functionName: "Canopus_API_Resolver",
        entry: "src/resolver-lambda/main.ts",
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

    const api = new appsync.GraphqlApi(this, "Canopus_API", {
      name: "Canopus_API",
      schema: appsync.SchemaFile.fromAsset("./src/graphql/schema.graphql"),
      logConfig: {
        retention: logs.RetentionDays.ONE_WEEK,
      },
    });

    const lambdaDataSource = api.addLambdaDataSource(
      "Canopus_Lambda_DS",
      resolverLambda
    );

    endpoints.forEach((endpoint) => {
      lambdaDataSource.createResolver("Canopus_Lambda_Resolver", {
        fieldName: endpoint,
        typeName: "Query",
      });
    });
  };
}
