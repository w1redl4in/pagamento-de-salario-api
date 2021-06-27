import { Namespace, createNamespace } from 'continuation-local-storage';
import logger from '@middlewares/logger';
import morgan from 'morgan-body';
import cors from 'cors';
import express, {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { ErrorHandler } from 'express-handler-errors';
import 'reflect-metadata';

import routes from './routes';
import swaggerRoutes from './swagger.routes';

class App {
  public readonly app: Application;

  private readonly session: Namespace;

  constructor() {
    this.app = express();
    this.session = createNamespace('session');
    this.middlewares();
    this.configSwagger();
    this.routes();
    this.errorHandle();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());

    const reqId = require('express-request-id');

    this.app.use(reqId());

    const attachContext: RequestHandler = (
      _: Request,
      __: Response,
      next: NextFunction
    ) => {
      this.session.run(() => next());
    };

    const setRequestId: RequestHandler = (
      req: Request,
      _: Response,
      next: NextFunction
    ) => {
      this.session.set('id', req.id);
      next();
    };

    this.app.use(attachContext, setRequestId);

    morgan(this.app, {
      noColors: true,
      prettify: false,
      logReqUserAgent: false,
      stream: {
        write: (msg: string) => logger.info(msg) as any,
      },
    });
  }

  private errorHandle(): void {
    this.app.use(
      (err: Error, _: Request, res: Response, next: NextFunction) => {
        new ErrorHandler().handle(err, res, next, logger as any);
      }
    );
  }

  private routes(): void {
    this.app.use('/validator', routes);
  }

  private async configSwagger(): Promise<void> {
    const swagger = await swaggerRoutes.load();
    this.app.use(swagger);
  }
}

export default new App();
