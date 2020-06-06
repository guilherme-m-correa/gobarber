import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/interfaces/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists && userExists.id !== user_id) {
      throw new AppError('This email was already taken');
    }

    if (new_password) {
      if (!old_password) {
        throw new AppError(
          'Cannot update password without inform old password',
        );
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError(
          'Cannot update password with incorrect old password',
        );
      }

      user.password = await this.hashProvider.generateHash(new_password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}

export default UpdateUserProfileService;
