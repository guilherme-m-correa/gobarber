import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvide';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateAvatar', () => {
  it('should be able to update avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'user-does-not-exists',
        avatar_filename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_filename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
});
