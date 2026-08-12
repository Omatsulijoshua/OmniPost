export class Logger {
  private static format(level: string, message: string, meta?: Record<string, any>): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta ? { meta } : {}),
    });
  }

  static info(message: string, meta?: Record<string, any>) {
    console.log(this.format('INFO', message, meta));
  }

  static warn(message: string, meta?: Record<string, any>) {
    console.warn(this.format('WARN', message, meta));
  }

  static error(message: string, meta?: Record<string, any>) {
    console.error(this.format('ERROR', message, meta));
  }

  static debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('DEBUG', message, meta));
    }
  }
}

export class OmniPostException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'OmniPostException';
  }
}

export class UnauthorizedException extends OmniPostException {
  constructor(message = 'Unauthorized access') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenException extends OmniPostException {
  constructor(message = 'Access forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundException extends OmniPostException {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class PlatformPublishException extends OmniPostException {
  constructor(platform: string, message: string, details?: any) {
    super(`PLATFORM_ERROR_${platform.toUpperCase()}`, message, 502, details);
  }
}
