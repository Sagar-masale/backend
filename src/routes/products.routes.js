import { Router } from "express";
import { getRingDataWithAdmin, getRingData } from "../controllers/ProductsController/ringData.controller.js"
import { getEarringDataWithAdmin, getEarringData } from "../controllers/ProductsController/earringData.controller.js"
import { getPendantDataWithAdmin, getPendantData } from "../controllers/ProductsController/pendantData.controller.js"
import { getMangalsutraDataWithAdmin, getMangalsutraData } from "../controllers/ProductsController/mangalsutraData.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const ringDataRouter = Router()
const earringDataRouter = Router()
const pendantDataRouter = Router()
const mangalsutraDataRouter = Router()


    ringDataRouter.route("/add-ring").post(
    upload.array("ProductImages", 10),getRingDataWithAdmin
    );
    ringDataRouter.route("/All-rings").get(getRingData);


    earringDataRouter.route("/add-earring").post(
    upload.array("ProductImages", 10),getEarringDataWithAdmin
    );
    earringDataRouter.route("/All-earrings").get(getEarringData);


    pendantDataRouter.route("/add-pendants").post(
        upload.array("ProductImages", 10),getPendantDataWithAdmin
    );
    pendantDataRouter.route("/All-pendants").get(getPendantData);


    mangalsutraDataRouter.route("/add-mangalsutra").post(
        upload.array("ProductImages", 10),getMangalsutraDataWithAdmin
    );
    mangalsutraDataRouter.route("/All-mangalsutra").get(getMangalsutraData);


export  { ringDataRouter, earringDataRouter, pendantDataRouter, mangalsutraDataRouter };