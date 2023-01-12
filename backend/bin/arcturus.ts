#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ArcturusStack } from "../lib/arcturus-stack";

const app = new App();
new ArcturusStack(app, "ArcturusStack");
