import { globalTeardown } from './globalSetup';

export default async function teardown() {
  await globalTeardown();
}
