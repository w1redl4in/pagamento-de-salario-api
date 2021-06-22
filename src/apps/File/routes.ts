import { Router } from 'express';

import 'express-async-errors';

import multer from 'multer';

import * as FileController from './FileController';

const route = Router();

const upload = multer();

route.post('/', upload.single('file'), FileController.create);

export default route;
