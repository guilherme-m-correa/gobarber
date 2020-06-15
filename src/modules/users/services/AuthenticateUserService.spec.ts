import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    const response = await authenticateUserService.execute({
      email: 'guilherme@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with invalid password', async () => {
    await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await expect(
      authenticateUserService.execute({
        email: 'guilherme@gmail.com',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a non existent user', async () => {
    await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await expect(
      authenticateUserService.execute({
        email: 'guilherme2@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
