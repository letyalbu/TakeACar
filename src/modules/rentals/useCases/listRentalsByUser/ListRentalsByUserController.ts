import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listRentalsByUserUser = container.resolve(ListRentalsByUserUseCase);

    const rentals = await listRentalsByUserUser.execute(id);

    return response.json(rentals);
  }
}

export { ListRentalsByUserController };
