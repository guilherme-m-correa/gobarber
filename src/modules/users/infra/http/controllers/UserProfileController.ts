import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import { classToClass } from 'class-transformer';

export default class UserProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showUserProfileService = container.resolve(ShowUserProfileService);

    const user = await showUserProfileService.execute({
      user_id,
    });

    return response.status(200).json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const { email, name, old_password, new_password } = request.body;

    const user = await updateUserProfileService.execute({
      email,
      name,
      user_id,
      new_password,
      old_password,
    });

    return response.status(200).json(classToClass(user));
  }
}
