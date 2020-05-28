import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
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
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    expect(
      authenticateUserService.execute({
        email: 'guilherme@gmail.com',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a non existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    expect(
      authenticateUserService.execute({
        email: 'guilherme2@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
