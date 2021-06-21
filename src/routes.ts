import { Router } from 'express';

import FileRoutes from '@apps/File/routes';

const route = Router();

route.use('/file', FileRoutes);

export default route;
