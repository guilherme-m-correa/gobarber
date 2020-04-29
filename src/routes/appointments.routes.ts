import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateRepositoryService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);

  const appointments = appointmentsRepository.find();

  if (!appointments) {
    return response.status(404).json({ message: 'No appointments found' });
  }

  return response.status(200).json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService();

    const appointment = await createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.status(200).json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
