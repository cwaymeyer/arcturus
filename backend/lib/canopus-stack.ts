import {
  Stack,
  StackProps,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  RemovalPolicy,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CanopusStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, "Canopus_Data", {
      tableName: "Canopus_Data",
      partitionKey: { name: "service", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const lambdaLayer = new lambda.LayerVersion(this, "Canopus_Dependencies", {
      compatibleRuntimes: [
        lambda.Runtime.PYTHON_3_8,
        lambda.Runtime.PYTHON_3_9,
      ],
      code: lambda.Code.fromAsset("../canopus/layers"),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const canopus = new lambda.Function(this, "Canopus", {
      functionName: "Canopus",
      code: lambda.Code.fromAsset("../canopus/src"),
      handler: "app.handler",
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: Duration.minutes(15),
      memorySize: 128,
      layers: [lambdaLayer],
    });

    canopus.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }
}
