import { extname } from 'path';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(
      new HttpException(
        'Only image and PDF files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const multerOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
    }),
    fileFilter: imageFileFilter,
};
