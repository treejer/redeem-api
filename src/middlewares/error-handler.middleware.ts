import {inject, injectable, Next, Provider} from '@loopback/core';
import {
  asMiddleware,
  HttpErrors,
  LogError,
  Middleware,
  MiddlewareContext,
  Response,
  RestBindings,
  RestMiddlewareGroups,
} from '@loopback/rest';

@injectable(
  asMiddleware({
    group: 'validationError',
    upstreamGroups: RestMiddlewareGroups.SEND_RESPONSE,
    downstreamGroups: RestMiddlewareGroups.CORS,
  }),
)
export class ErrorHandlerMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
  ) {}

  async value() {
    const middleware: Middleware = async (
      ctx: MiddlewareContext,
      next: Next,
    ) => {
      try {
        return await next();
      } catch (err) {
        // Any error handling goes here
        return this.handleError(ctx, err);
      }
    };
    return middleware;
  }

  handleError(context: MiddlewareContext, err: HttpErrors.HttpError): Response {
    this.logError(err, err.statusCode, context.request);
    throw err;
  }
}
