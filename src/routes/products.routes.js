import { Router } from "express";
import { getRingDataWithAdmin, getRingData } from "../controllers/ProductsController/ringData.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const ringDataRouter = Router()

ringDataRouter.route("/add-ring").post(
    upload.array("ProductImages", 10),getRingDataWithAdmin)

    ringDataRouter.route("/All-rings").get(getRingData);

export default ringDataRouter