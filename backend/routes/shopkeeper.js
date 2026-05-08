const express = require("express");
const router = express.Router();

const Shop = require("../models/Shop");
const User = require("../models/User");

router.post("/create-shop", async (req, res) => {
  try {
    const {
      userId,
      name,
      category,
      address,
      imageUrl,
      lat,
      lng,
    } = req.body;

    // update role
    await User.findByIdAndUpdate(userId, {
      role: "shop_owner",
    });

    // create shop
    const shop = await Shop.create({
      name,
      category,
      address,
      imageUrl,
      owner: userId,

      isPartner: true,

      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    res.status(201).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/my-shop", async (req, res) => {
  try {
    const { userId } = req.query;
    const shop = await Shop.findOne({ owner: userId });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;