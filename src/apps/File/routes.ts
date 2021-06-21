import { Router } from 'express';

import * as FileController from './FileController';

const route = Router();

route.post('/', FileController.create);

export default route;
