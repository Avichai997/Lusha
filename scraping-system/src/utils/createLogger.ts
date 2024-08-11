import pino, { Logger, LogFn } from 'pino';
import { pinoHttp } from 'pino-http';
import { Express } from 'express';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import path from 'path';

const timeFormatter = () => {
  const timestamp = Date.now();
  const zonedDate = toZonedTime(timestamp, Intl.DateTimeFormat().resolvedOptions().timeZone);

  return `,"time":"${format(zonedDate, 'yyyy-MM-dd HH:mm:ss.SSS XXX')}"`;
};

const getCallerFile = (): string => {
  const originalFunc = Error.prepareStackTrace;

  let callerFile = '';
  try {
    const err = new Error();
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = err.stack as unknown as {
      getFileName: () => string | null;
    }[];

    if (stack) {
      for (let i = 2; i < stack.length; i++) {
        const frame = stack[i];
        const fileName = frame.getFileName();
        if (fileName && !fileName.includes('node_modules')) {
          callerFile = fileName;
          break;
        }
      }
    }
  } catch (e) {
    // Empty block to catch errors
  }
  Error.prepareStackTrace = originalFunc;
  const relativeFile = callerFile ? path.relative(process.cwd(), callerFile) : 'unknown';

  return relativeFile;
};

const createWrappedLogger = (logger: Logger, service: string, version: string): Logger => {
  const levels: (keyof Logger)[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

  const wrappedLogger: Partial<Record<keyof Logger, LogFn>> = {};
  levels.forEach((level) => {
    wrappedLogger[level] = (...args: unknown[]) => {
      const callerFile = getCallerFile();
      const [msg, ...rest] = args;
      const location = callerFile;
      const additionalInfo = {
        filename: location,
        service,
        version,
      };
      if (typeof msg === 'string') {
        // @ts-ignore
        logger[level]({ ...additionalInfo }, msg, ...rest);
      } else if (typeof msg === 'object' && msg !== null) {
        // @ts-ignore
        logger[level]({ ...additionalInfo, ...(msg as object) }, ...rest);
      } else {
        // @ts-ignore
        logger[level]({ ...additionalInfo }, ...args);
      }
    };
  });

  // @ts-ignore
  wrappedLogger.child = logger.child.bind(logger);

  return wrappedLogger as unknown as Logger;
};

export const createLogger = (serviceName: string, version: string) => {
  const { NODE_ENV } = process.env;
  if (!NODE_ENV) throw new Error('NODE_ENV environment variable is not set.');

  const isProdEnv = NODE_ENV === 'production';

  const baseLogger = pino(
    {
      level: isProdEnv ? 'info' : 'debug',
      timestamp: timeFormatter,
      redact: {
        paths: ['req.headers.authorization'],
        censor: '******',
      },
    },
    isProdEnv
      ? undefined
      : pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: false,
            ignore: 'pid,hostname,dd',
          },
        })
  );

  const logger = createWrappedLogger(baseLogger, serviceName, version);

  return { baseLogger, logger };
};

