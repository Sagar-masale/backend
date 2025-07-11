
import express from "express";
import metalRate from "../models/metalRate.js";

const Metalrouter = express.Router();

Metalrouter.get("/metal-rate", async (req, res) => {
  const rate = await metalRate.findOne();
  res.json(rate);
});

export default Metalrouter;
