#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config();

import * as cdk from 'aws-cdk-lib';
import { SRGFrontendStack } from '../lib/srg-frontend-stack';

const app = new cdk.App();

const { AWS_CLUSTER_ARN, AWS_DEFAULT_SG, AWS_VPC_ID } = process.env;

if (!AWS_CLUSTER_ARN) throw new Error('AWS_CLUSTER_ARN env is undefined!');
if (!AWS_DEFAULT_SG) throw new Error('AWS_DEFAULT_SG env is undefined!');
if (!AWS_VPC_ID) throw new Error('AWS_VPC_ID env is undefined');

new SRGFrontendStack(app, 'srg-fe-stack', {
  aws_env: {
    AWS_CLUSTER_ARN,
    AWS_DEFAULT_SG,
    AWS_VPC_ID,
  },
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
