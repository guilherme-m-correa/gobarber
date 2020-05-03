import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid email', 401);
    }

    const password_matched = await compare(password, user.password);

    if (!password_matched) {
      throw new AppError('Incorrect password', 401);
    }

    const token = jwt.sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expires,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
