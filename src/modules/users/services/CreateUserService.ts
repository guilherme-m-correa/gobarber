import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/interfaces/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateRepositoryService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userEmailAlreadyExists = await this.usersRepository.findByEmail(
      email,
    );

    if (userEmailAlreadyExists) {
      throw new AppError('This email was already taken');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}

export default CreateRepositoryService;
