import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateRepositoryService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const userEmailAlreadyExists = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (userEmailAlreadyExists) {
      throw new Error('This email was already taken');
    }

    const passwordHash = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateRepositoryService;
