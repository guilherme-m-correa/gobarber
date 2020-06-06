import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'guilherme@gmail.com',
      password: '123456',
      name: 'Guilherme',
    });

    const profile = await showUserProfileService.execute({
      user_id: user.id,
    });

    expect(profile.email).toBe('guilherme@gmail.com');
    expect(profile.name).toBe('Guilherme');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showUserProfileService.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
