#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ArcturusStack } from "../lib/arcturus-stack";
import { CanopusStack } from "../lib/canopus-stack";

const app = new App();

new ArcturusStack(app, "ArcturusStack");
new CanopusStack(app, "CanopusStack");
