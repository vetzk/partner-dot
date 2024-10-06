import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      // if (!token) {
      //   throw {
      //     rc: 404,
      //     message: 'Token does not exist',
      //   };
      // }

      if (!token) {
        return res.status(401).send({
          success: false,
          message: 'Token does not exist',
        });
      }

      const checkToken = verify(
        token,
        process.env.TOKEN_KEY || 'f9c320c6-176a-4937-b1fd-a0b529e1fa1d',
      );
      console.log(checkToken);
      res.locals.decrypt = checkToken;
      next();
    } catch (error) {
      // console.log(error);
      // next({
      //   success: false,
      //   message: 'Cannot verify your token',
      //   error,
      // });
      console.log(error);
      next(new UnauthorizedException('Cannot verify your token'));
    }
  }
}
