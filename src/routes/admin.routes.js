import { Router } from "express";
import { loginAdmin, logoutAdmin, refreshAccessTokenAdmin, getCurrentAdmin, registerAdmin, getAllUsers } from "../controllers/admin.controller.js"
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import metalRate from "../models/metalRate.js";

const adminRouter = Router();


// for Admin
adminRouter.route("/register-admin").post(registerAdmin)
adminRouter.route("/login-admin").post(loginAdmin)
adminRouter.route("/logout-admin").post(verifyJWT, logoutAdmin)
adminRouter.route("/refresh-token-admin").post(refreshAccessTokenAdmin)
adminRouter.route("/current-admin").get(verifyJWT, getCurrentAdmin)
adminRouter.route("/All-Users").get(getAllUsers)

adminRouter.post("/set-metal-rate", async (req, res) => {
  const { gold, silver } = req.body;

  if (!gold || !silver) {
    return res.status(400).json({ message: "Gold and silver prices are required" });
  }

  await metalRate.findOneAndUpdate(
    {},
    { gold, silver, updatedAt: new Date() },
    { upsert: true }
  );

  res.status(200).json({ message: "Metal rates updated successfully" });
});

export default adminRouter