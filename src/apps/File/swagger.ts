const paths = {
  '/file': {
    post: {
      tags: ['File'],
      summary: 'File',
      description:
        'Recebe um arquivo com informações de usuários para pagamento de salário',
      consumes: 'multipart/form-data',
      parameters: [
        {
          in: 'formData',
          name: 'file',
          type: 'file',
        },
      ],
      responses: {
        200: {
          description: 'OK',
          schema: {
            $ref: '#/definitions/File',
          },
        },
        404: {
          description: 'Not Found',
          schema: {
            $ref: '#/definitions/ErrorResponse',
          },
        },
      },
    },
  },
};

const definitions = {
  File: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
    },
  },
};

export default { paths, definitions };
