import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authenticate User", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "123456",
      email: "user@example.com",
      password: "12345",
      name: "User Name",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "wrong@example.com",
        password: "12345",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect!"));
  });

  it("should not be able to authenticate with an incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "12345",
      email: "user@example.com",
      password: "12345",
      name: "User Name",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect!"));
  });
});
