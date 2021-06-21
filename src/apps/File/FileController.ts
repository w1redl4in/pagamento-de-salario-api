import { Request, Response } from 'express';

import FileService from './FileService';

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const response = await FileService.create(req.body);
  return res.json(response);
};
