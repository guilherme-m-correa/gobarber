// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2020, 4, 20, 11, 0, 0).getTime();

      return customDate;
    });

    // Only appointments from 08-16h
    const eachHourArray = Array.from({ length: 8 }, (_, index) => index + 8);

    await Promise.all(
      eachHourArray.map(async hour => {
        await fakeAppointmentsRepository.create({
          user_id: 'logged-user-id',
          provider_id: 'provider-id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        });
      }),
    );

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider-id',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
