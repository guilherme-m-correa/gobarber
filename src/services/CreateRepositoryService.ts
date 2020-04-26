import { startOfHour } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
  provider: string;

  date: Date;
}

class CreateRepositoryService {
  private appointmentsRepository: AppointmentRepository;

  constructor(appointmentsRepository: AppointmentRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentsInTheSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentsInTheSameDate) {
      throw new Error('Appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateRepositoryService;
