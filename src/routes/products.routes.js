import { Router } from "express";
import { getRingDataWithAdmin, getRingData, deleteRingData, updateRingData, getRingById  } from "../controllers/ringData.controller.js"
import { getEarringDataWithAdmin, getEarringData, getEarringById } from "../controllers/earringData.controller.js"
import { getPendantDataWithAdmin, getPendantData, getPendantById } from "../controllers/pendantData.controller.js"
import { getMangalsutraDataWithAdmin, getMangalsutraData, getMangalsutraById } from "../controllers/mangalsutraData.controller.js"
import { getBangleDataWithAdmin, getBangleData, getBangleById } from "../controllers/bangleData.controller.js"
import { getChainDataWithAdmin, getChainData, getChainById } from "../controllers/chainData.controller.js"

import { 
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getAllReview
} from "../controllers/userReview.controller.js"

import {upload} from "../middlewares/multer.middleware.js"

const reviewRouter = Router();


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
ringDataRouter.route("/get-productBy-id").get(getRingById);

ringDataRouter.route("/delete-ring").delete(deleteRingData);
ringDataRouter.route("/update-ring").put(updateRingData);

// Earring routes
earringDataRouter
  .route("/add-earring")
  .post(upload.array("ProductImages", 10), getEarringDataWithAdmin);
earringDataRouter.route("/All-earrings").get(getEarringData);
earringDataRouter.route("/get-earringBy-id").get(getEarringById);


// Pendant routes
pendantDataRouter
  .route("/add-pendants")
  .post(upload.array("ProductImages", 10), getPendantDataWithAdmin);
pendantDataRouter.route("/All-pendants").get(getPendantData);
pendantDataRouter.route("/get-pendantBy-id").get(getPendantById);


// Mangalsutra routes
mangalsutraDataRouter
  .route("/add-mangalsutra")
  .post(upload.array("ProductImages", 10), getMangalsutraDataWithAdmin);
mangalsutraDataRouter.route("/All-mangalsutra").get(getMangalsutraData);
mangalsutraDataRouter.route("/get-mangalsutraBy-id").get(getMangalsutraById);

// Bangle routes
bangleDataRouter
  .route("/add-bangles")
  .post(upload.array("ProductImages", 10), getBangleDataWithAdmin);
bangleDataRouter.route("/All-bangles").get(getBangleData);
bangleDataRouter.route("/get-bangleBy-id").get(getBangleById);


chainDataRouter
  .route("/add-chains")
  .post(upload.array("ProductImages", 10), getChainDataWithAdmin);
chainDataRouter.route("/All-chains").get(getChainData)
chainDataRouter.route("/get-chainBy-id").get(getChainById);

reviewRouter.route("/add-review").post(createReview);
reviewRouter.route("/get-reviewBy-productId").get(getReviewsByProduct);
reviewRouter.route("/get-reviewBy-userId").get(getReviewsByUser);
reviewRouter.route("/update-review").put(updateReview);
reviewRouter.route("/delete-review").delete(deleteReview);
reviewRouter.route("/getAll-reviews").get(getAllReview);

export {
  ringDataRouter,
  earringDataRouter,
  pendantDataRouter,
  mangalsutraDataRouter,
  bangleDataRouter,
  chainDataRouter,
  reviewRouter
};  