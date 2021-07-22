import { Router } from "express";

import { SendForgotPasswordMailController } from "@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";

const passwordsRoutes = Router();

const sendForgotPasswordMailController = new SendForgotPasswordMailController();

passwordsRoutes.post("/forgot", sendForgotPasswordMailController.handle);

export { passwordsRoutes };
