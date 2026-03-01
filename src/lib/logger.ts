export type LogMeta = Record<string, unknown>;

function stringify(meta?: LogMeta): string {
  return meta ? ` ${JSON.stringify(meta)}` : "";
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    console.info(`[info] ${message}${stringify(meta)}`);
  },
  warn(message: string, meta?: LogMeta): void {
    console.warn(`[warn] ${message}${stringify(meta)}`);
  },
  error(message: string, meta?: LogMeta): void {
    console.error(`[error] ${message}${stringify(meta)}`);
  }
};
