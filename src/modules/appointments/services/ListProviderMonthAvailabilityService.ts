import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, endOfDay, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year },
    );

    const numberOfDaysInMonth = getDaysInMonth(month - 1);

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      const compareDate = endOfDay(new Date(year, month - 1, day));

      const isAvailable =
        appointmentsInDay.length < 10 && isAfter(compareDate, new Date());

      return {
        day,
        available: isAvailable,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
