import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Description",
      daily_rate: 100,
      license_plate: "test",
      category_id: "1234",
      brand: "test",
      fine_amount: 100,
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental for a user with another open process", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Description",
      daily_rate: 100,
      license_plate: "test",
      category_id: "1234",
      brand: "test",
      fine_amount: 100,
    });

    await createRentalUseCase.execute({
      user_id: "user id test",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "user id test",
        car_id: "1234",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental for a car with another open process", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Description",
      daily_rate: 100,
      license_plate: "test",
      category_id: "1234",
      brand: "test",
      fine_amount: 100,
    });

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("This car is not available"));
  });

  it("should not be able to create a new rental with an expected return date less than 24 hours", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Description",
      daily_rate: 100,
      license_plate: "test",
      category_id: "1234",
      brand: "test",
      fine_amount: 100,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid expected return date!"));
  });
});
