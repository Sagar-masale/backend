import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, getCurrentUser } from "../controllers/user.controller.js";
import { loginAdmin, logoutAdmin, refreshAccessTokenAdmin as refreshAdminAccessToken, getCurrentAdmin } from "../controllers/admin.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// for Admin
router.route("/login-admin").post(loginAdmin)
router.route("/logout-admin").post(verifyJWT, logoutAdmin)
router.route("/refresh-token-admin").post(refreshAdminAccessToken)
router.route("/current-admin").get(verifyJWT, getCurrentAdmin)


// for User
router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router