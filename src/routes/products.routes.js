import { Router } from "express";
import { getRingDataWithAdmin, getRingData } from "../controllers/ProductsController/ringData.controller.js"
import { getEarringDataWithAdmin, getEarringData } from "../controllers/ProductsController/earringData.controller.js"
import { getPendantDataWithAdmin, getPendantData } from "../controllers/ProductsController/pendantData.controller.js"
import { getMangalsutraDataWithAdmin, getMangalsutraData } from "../controllers/ProductsController/mangalsutraData.controller.js"
import { getBangleDataWithAdmin, getBangleData } from "../controllers/ProductsController/bangleData.controller.js"
import { getChainDataWithAdmin, getChainData } from "../controllers/ProductsController/chainData.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
// Initialize routers
const ringDataRouter = Router();
const earringDataRouter = Router();
const pendantDataRouter = Router();
const mangalsutraDataRouter = Router();
const bangleDataRouter = Router();
const chainDataRouter = Router();

// Ring routes
ringDataRouter
  .route("/add-ring")
  .post(upload.array("ProductImages", 10), getRingDataWithAdmin);
ringDataRouter.route("/All-rings").get(getRingData);

// Earring routes
earringDataRouter
  .route("/add-earring")
  .post(upload.array("ProductImages", 10), getEarringDataWithAdmin);
earringDataRouter.route("/All-earrings").get(getEarringData);

// Pendant routes
pendantDataRouter
  .route("/add-pendants")
  .post(upload.array("ProductImages", 10), getPendantDataWithAdmin);
pendantDataRouter.route("/All-pendants").get(getPendantData);

// Mangalsutra routes
mangalsutraDataRouter
  .route("/add-mangalsutra")
  .post(upload.array("ProductImages", 10), getMangalsutraDataWithAdmin);
mangalsutraDataRouter.route("/All-mangalsutra").get(getMangalsutraData);

// Bangle routes
bangleDataRouter
  .route("/add-bangles")
  .post(upload.array("ProductImages", 10), getBangleDataWithAdmin);
bangleDataRouter.route("/All-bangles").get(getBangleData);

// Chain routes
chainDataRouter
  .route("/add-chains")
  .post(upload.array("ProductImages", 10), getChainDataWithAdmin);
chainDataRouter.route("/All-chains").get(getChainData)

// Export all routers
export {
  ringDataRouter,
  earringDataRouter,
  pendantDataRouter,
  mangalsutraDataRouter,
  bangleDataRouter,
  chainDataRouter
};  