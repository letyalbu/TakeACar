import { Request, Response } from "express";
import { container } from "tsyringe";

import { RemoveCarImagesUseCase } from "./RemoveCarImagesUseCase";

class RemoveCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { images_ids } = request.body;

    const removeCarImagesUseCase = container.resolve(RemoveCarImagesUseCase);

    await removeCarImagesUseCase.execute({ images_ids });

    return response.status(204).send();
  }
}

export { RemoveCarImagesController };
