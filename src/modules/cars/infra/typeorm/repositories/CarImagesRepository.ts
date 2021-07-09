import { getRepository, Repository } from "typeorm";

import { ICarImagesRepository } from "@modules/cars/repositories/ICarImagesRepository";

import { CarImage } from "../entities/CarImage";

class CarImagesRepository implements ICarImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const car_image = this.repository.create({
      car_id,
      image_name,
    });

    await this.repository.save(car_image);

    return car_image;
  }

  async delete(car_image: CarImage): Promise<void> {
    await this.repository.remove(car_image);
  }

  async findById(id: string): Promise<CarImage> {
    const car_image = await this.repository.findOne(id);

    return car_image;
  }
}

export { CarImagesRepository };
