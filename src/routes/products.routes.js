import { Router } from "express";
import { getRingDataWithAdmin, getRingData } from "../controllers/ProductsController/ringData.controller.js"
import { getEarringDataWithAdmin, getEarringData } from "../controllers/ProductsController/earringData.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const ringDataRouter = Router()
const earringDataRouter = Router()

ringDataRouter.route("/add-ring").post(
    upload.array("ProductImages", 10),getRingDataWithAdmin
    );
    ringDataRouter.route("/All-rings").get(getRingData);

earringDataRouter.route("/add-earring").post(
    upload.array("ProductImages", 10),getEarringDataWithAdmin
    );
    earringDataRouter.route("/All-earrings").get(getEarringData);
    export  { ringDataRouter, earringDataRouter };