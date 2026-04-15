import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export interface LogContext {
  method?: string;
  url?: string;
  ip?: string;
  userId?: string;
  userAgent?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
}

export function logRequest(context: LogContext) {
  logger.info({
    type: 'request',
    ...context,
  });
}

export function logError(context: LogContext & { error: Error | string }) {
  const errorMessage = typeof context.error === 'object' && context.error !== null && 'message' in context.error
    ? (context.error as Error).message
    : context.error;

  logger.error({
    type: 'error',
    ...context,
    errorMessage,
  });
}

export function logAuthAttempt(context: LogContext & { action: 'login' | 'register' | 'logout' }) {
  logger.info({
    type: 'auth',
    ...context,
  });
}

export function logAIAnalysis(context: LogContext & { decision?: string; mockMode?: boolean }) {
  logger.info({
    type: 'ai_analysis',
    ...context,
  });
}

export default logger;
