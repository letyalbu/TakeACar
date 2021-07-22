import { Router } from "express";

import { ResetPasswordUserController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";
import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordsRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordUserController();

passwordsRoutes.post("/forgot", sendForgotPasswordMailController.handle);
passwordsRoutes.post("/reset", resetPasswordController.handle);

export { passwordsRoutes };
