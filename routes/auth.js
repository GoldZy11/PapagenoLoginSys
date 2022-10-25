import { Router } from "express";
import {
    deleteUser,
    editUser,
    getAllUser,
    getUserByRut,
    loginUser,
    registerUser,
} from "../controllers/auth";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/editUser", editUser);
authRouter.delete("/deleteUser/:rut", deleteUser);
authRouter.get("/allUsers", getAllUser);
authRouter.get("/UserRut/:rut", getUserByRut);

export { authRouter };
