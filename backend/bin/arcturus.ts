#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ArcturusStack } from "../lib/arcturus-stack";
import { CanopusStack } from "../lib/canopus-stack";
import { CanopusApiStack } from "../lib/canopus-api-stack";

const app = new App();

new ArcturusStack(app, "Arcturus");
new CanopusStack(app, "Canopus");
new CanopusApiStack(app, "CanopusApi");

/**
 * 🟢🟢🟢 Arcturus 🟢🟢🟢
 * RESOURCES:
 * 🔵 S3 bucket for static site hosting
 * 🔵 CloudFront distribution
 *
 * DESCRIPTION:
 * 'Arcturus' is the original name for IAM Generator
 * Located => './frontend'
 * Frontend built with React and Grommet for UI
 *
 * 🟢🟢🟢 Canopus 🟢🟢🟢
 * RESOURCES:
 * 🔵 DynamoDB table for storing scraped AWS data
 * No GSIs, all queries through PK ('services': <service_name>) and SK ('sk': <TYPE>#<ACCESS-LEVEL>#<name>)
 * 'services': 'SERVICE_NAMES' query lists all services
 * 🔵 ECS Fargate task for scraping data
 * 🔵 Eventbridge Rule to run task at 7pm EST on the 1st of each month
 *
 * DESCRIPTION:
 * 'Canopus' is a python scraper that runs through AWS documentation for service and actions related data
 * Located => './canopus/src'
 * Populates and updates the Canopus Dynamo table
 *
 * 🟢🟢🟢 Canopus API 🟢🟢🟢
 * RESOURCES:
 * 🔵 API Gateway
 * 🔵 Single Lambda handler
 * Endpoints: '/services', '/service-data'
 * Read access to Canopus table
 *
 * DESCRIPTION:
 * Canopus API is the access point to the Canopus database
 */
