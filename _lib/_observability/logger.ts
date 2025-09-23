import { env } from '@/_lib/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level: LogLevel): boolean {
  const configured = (env.LOG_LEVEL ?? 'info') as LogLevel;
  return levelPriority[level] >= levelPriority[configured];
}

function format(entry: { level: LogLevel; message: string; requestId?: string; data?: unknown }) {
  const base = {
    ts: new Date().toISOString(),
    level: entry.level,
    msg: entry.message,
    requestId: entry.requestId,
  } as Record<string, unknown>;
  if (entry.data !== undefined) base.data = entry.data;
  return JSON.stringify(base);
}

export function createLogger(requestId?: string) {
  return {
    debug(message: string, data?: unknown) {
      if (shouldLog('debug')) console.debug(format({ level: 'debug', message, requestId, data }));
    },
    info(message: string, data?: unknown) {
      if (shouldLog('info')) console.info(format({ level: 'info', message, requestId, data }));
    },
    warn(message: string, data?: unknown) {
      if (shouldLog('warn')) console.warn(format({ level: 'warn', message, requestId, data }));
    },
    error(message: string, data?: unknown) {
      if (shouldLog('error')) console.error(format({ level: 'error', message, requestId, data }));
    },
  };
}

export function getRequestIdFromHeaders(headers: Headers): string {
  return headers.get('x-request-id') || crypto.randomUUID();
}

