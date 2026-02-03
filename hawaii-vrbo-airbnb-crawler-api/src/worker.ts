import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runWorker() {
  console.log('Starting Temporal worker...');

  try {
    const worker = await Worker.create({
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      taskQueue: 'tvr-compliance-queue',
      workflowsPath: require.resolve('./workflows'),
      activities,
    });

    console.log('Worker started successfully, listening for tasks...');
    await worker.run();
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

runWorker().catch(console.error);
