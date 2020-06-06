import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Guilherme2',
      email: 'guilherme2@gmail.com',
    });

    expect(updatedUser.name).toBe('Guilherme2');
    expect(updatedUser.email).toBe('guilherme2@gmail.com');
  });

  it('should not be able to update field email to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    const user = await fakeUsersRepository.create({
      email: 'test@gmail.com',
      password: '123456',
      name: 'Test',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Guilherme',
        email: 'guilherme@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Guilherme2',
      email: 'guilherme2@gmail.com',
      old_password: '123456',
      new_password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Guilherme2',
        email: 'guilherme2@gmail.com',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with incorrect old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Guilherme2',
        email: 'guilherme2@gmail.com',
        old_password: 'incorrect-old-password',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'Guilherme',
        email: 'guilherme@gmail.com',
        old_password: '123456',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
