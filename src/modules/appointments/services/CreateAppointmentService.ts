import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    const currentDate = new Date(Date.now());

    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError('Cannot create appointments with yourself');
    }

    if (isBefore(appointmentDate, currentDate)) {
      throw new AppError('Cannot create appointments on past dates');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('Cannot create appointments before 8h or after 17h');
    }

    const findAppointmentsInTheSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentsInTheSameDate) {
      throw new AppError('Appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
