import { inject, injectable } from "tsyringe";

import { ICarImagesRepository } from "@modules/cars/repositories/ICarImagesRepository";
import { deleteFile } from "@utils/file";

interface IRequest {
  images_ids: string[];
}

@injectable()
class RemoveCarImagesUseCase {
  constructor(
    @inject("CarImagesRepository")
    private carImagesRepository: ICarImagesRepository
  ) {}

  async execute({ images_ids }: IRequest): Promise<void> {
    images_ids.map(async (image) => {
      const car_image = await this.carImagesRepository.findById(image);

      await deleteFile(`./tmp/carImages/${car_image.image_name}`);

      await this.carImagesRepository.delete(car_image);
    });
  }
}

export { RemoveCarImagesUseCase };
