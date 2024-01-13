#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config();

import * as cdk from 'aws-cdk-lib';
import { SRGFrontendStack } from '../lib/srg-frontend-stack';

const app = new cdk.App();

const {
  AWS_CLUSTER_ARN,
  AWS_DEFAULT_SG,
  AWS_VPC_ID,
  CLIENT_ID,
  DATA_BASE_URL,
  MAPBOX_ACCESS_TOKEN,
  REDIRECT_URI_HOST,
} = process.env;

if (!AWS_CLUSTER_ARN) throw new Error('AWS_CLUSTER_ARN env is undefined!');
if (!AWS_DEFAULT_SG) throw new Error('AWS_DEFAULT_SG env is undefined!');
if (!AWS_VPC_ID) throw new Error('AWS_VPC_ID env is undefined');
if (!CLIENT_ID) throw new Error('CLIENT_ID env is undefined!');
if (!DATA_BASE_URL) throw new Error('DATA_BASE_URL env is undefined!');
if (!MAPBOX_ACCESS_TOKEN)
  throw new Error('MAPBOX_ACCESS_TOKEN env is undefined');
if (!REDIRECT_URI_HOST) throw new Error('REDIRECT_URI_HOST env is undefined!');

new SRGFrontendStack(app, 'srg-fe-stack', {
  aws_env: {
    AWS_CLUSTER_ARN,
    AWS_DEFAULT_SG,
    AWS_VPC_ID,
  },
  svc_env: {
    CLIENT_ID,
    DATA_BASE_URL,
    REDIRECT_URI_HOST,
    MAPBOX_ACCESS_TOKEN,
  },
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
