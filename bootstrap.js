import dotenv from "dotenv";
dotenv.config();

import { useAzureMonitor } from "@azure/monitor-opentelemetry";

if (
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING &&
  process.env.NODE_ENV !== "test"
) {
  useAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    },
  });
}

await import("./server-main.js");
