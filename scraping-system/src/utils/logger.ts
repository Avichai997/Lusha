import { createLogger } from './createLogger';
import * as fs from 'fs';
import * as path from 'path';

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const { name, version } = packageJson;

export const { logger } = createLogger(name, version);
