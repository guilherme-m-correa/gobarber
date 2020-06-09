// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + 8);

    await Promise.all(
      eachHourArray.map(async hour => {
        await fakeAppointmentsRepository.create({
          user_id: 'logged-user-id',
          provider_id: 'provider-id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        });
      }),
    );

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider-id',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
