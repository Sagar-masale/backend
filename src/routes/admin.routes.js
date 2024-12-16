import { Router } from "express";
import { loginAdmin, logoutAdmin, refreshAccessTokenAdmin, getCurrentAdmin, registerAdmin } from "../controllers/admin.controller.js"
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const adminRouter = Router()

// for Admin
adminRouter.route("/register-admin").post(registerAdmin)
adminRouter.route("/login-admin").post(loginAdmin)
adminRouter.route("/logout-admin").post(verifyJWT, logoutAdmin)
adminRouter.route("/refresh-token-admin").post(refreshAccessTokenAdmin)
adminRouter.route("/current-admin").get(verifyJWT, getCurrentAdmin)

export default adminRouter