import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "633211",
      email: "vib@zuzpomu.ng",
      name: "Marc Moss",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("vib@zuzpomu.ng");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an mail if user does not exist", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("eso@edmaiz.nc")
    ).rejects.toEqual(new AppError("Email not found!"));
  });

  it("should be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      driver_license: "690235",
      email: "fo@lohozo.ml",
      name: "Douglas Hamilton",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("fo@lohozo.ml");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
