import { Router } from "express";
import { getRingDataWithAdmin } from "../controllers/ProductsController/ringData.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const ringDataRouter = Router()

ringDataRouter.route("/add-ring").post(
    upload.single("ProductImages"),getRingDataWithAdmin)

export default ringDataRouter