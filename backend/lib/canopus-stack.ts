import {
  Stack,
  StackProps,
  aws_dynamodb as dynamodb,
  aws_ecs as ecs,
  aws_events as events,
  aws_events_targets as eventstargets,
  aws_iam as iam,
  RemovalPolicy,
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
  }
}
