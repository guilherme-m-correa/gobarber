import jwt from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/interfaces/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email', 401);
    }

    const password_matched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

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
