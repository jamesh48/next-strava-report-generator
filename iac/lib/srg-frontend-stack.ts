import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface SRGFrontendStackProps extends cdk.StackProps {
  aws_env: {
    AWS_CLUSTER_ARN: string;
    AWS_DEFAULT_SG: string;
    AWS_VPC_ID: string;
  };
  svc_env: {
    CLIENT_ID: string;
    DATA_BASE_URL: string;
    EXPRESS_SESSION_COOKIE_NAME: string;
    EXPRESS_SESSION_SECRET: string;
    REDIRECT_URI_HOST: string;
  };
}
export class SRGFrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SRGFrontendStackProps) {
    super(scope, id, props);

    const srgFeFargateService = new ecs.FargateService(this, 'srgf-service', {
      assignPublicIp: true,
      desiredCount: 1,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1,
        },
      ],
      taskDefinition: new ecs.FargateTaskDefinition(
        this,
        'srgf-task-definition',
        {
          taskRole: iam.Role.fromRoleName(
            this,
            'jh-ecs-task-definition-role',
            'jh-ecs-task-definition-role'
          ),
          executionRole: iam.Role.fromRoleName(
            this,
            'jh-ecs-task-execution-role',
            'jh-ecs-task-execution-role'
          ),
        }
      ),
      cluster: ecs.Cluster.fromClusterAttributes(this, 'jh-impoted-cluster', {
        securityGroups: [
          ec2.SecurityGroup.fromSecurityGroupId(
            this,
            'imported-default-sg',
            props.aws_env.AWS_DEFAULT_SG
          ),
        ],
        clusterName: 'jh-e1-ecs-cluster',
        clusterArn: props.aws_env.AWS_CLUSTER_ARN,
        vpc: ec2.Vpc.fromLookup(this, 'jh-imported-vpc', {
          vpcId: props.aws_env.AWS_VPC_ID,
        }),
      }),
      enableExecuteCommand: true,
    });

    const container = srgFeFargateService.taskDefinition.addContainer(
      'srgFrontend-container',
      {
        environment: {
          ...props.svc_env,
        },
        image: ecs.ContainerImage.fromAsset('../'),
        logging: new ecs.AwsLogDriver({
          streamPrefix: 'srgf-container',
          logRetention: logs.RetentionDays.FIVE_DAYS,
        }),
      }
    );

    container.addPortMappings({
      containerPort: 8000,
      hostPort: 8000,
    });

    const importedALBListener = elbv2.ApplicationListener.fromLookup(
      this,
      'imported-https-listener',
      {
        listenerArn:
          'arn:aws:elasticloadbalancing:us-east-1:471507967541:listener/app/jh-alb/5927623bf7b387b8/202d118fecee2aa5',
      }
    );

    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'srgf-tg', {
      // targetGroupName: 'srg-svc-target',
      port: 8000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [srgFeFargateService],
      vpc: ec2.Vpc.fromLookup(this, 'jh-imported-vpc-tg', {
        vpcId: props.aws_env.AWS_VPC_ID,
      }),
      healthCheck: {
        path: '/',
        unhealthyThresholdCount: 2,
        healthyHttpCodes: '200',
        healthyThresholdCount: 5,
        interval: cdk.Duration.seconds(30),
        port: '8000',
        timeout: cdk.Duration.seconds(10),
      },
    });

    importedALBListener.addTargetGroups('srgf-listener-tg', {
      targetGroups: [targetGroup],
      priority: 25,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['stravareportgenerator.com']),
        // elbv2.ListenerCondition.pathPatterns(['/', '/srg/*']),
      ],
    });
  }
}
