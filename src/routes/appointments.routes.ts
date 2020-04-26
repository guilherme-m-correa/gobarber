import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateRepositoryService';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.findAll();

  if (!appointments) {
    return response.status(404).json({ message: 'No appointments found' });
  }

  return response.status(200).json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.status(200).json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
