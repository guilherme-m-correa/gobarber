import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user if email already exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    expect(
      createUserService.execute({
        email: 'guilherme@gmail.com',
        password: '123456',
        name: 'Guilherme',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
