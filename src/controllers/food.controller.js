import Food from "../models/Food.js";

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const seedFoods = async (req, res) => {
  try {
     await Food.deleteMany({});

    const foods = [
      {
        name: "Idly",
        description: "Soft steamed rice cakes from South India...",
        images: [
        "/images/idly_2.png",
        "/images/idly.jpg",
        "/images/idly_5.png"
      ],
        isVeg: true,
        country: "India"
      },
      {
        name: "Chicken Biryani",
        description: "Aromatic rice layered with marinated chicken...",
        images: [
        "/images/chicken_biryani.jpg",
        "/images/chicken_biryani_blur.png",
        "/images/chicken_biryani_bw.png",
        "/images/chicken_biryani_dim.png"
      ],
        isVeg: false,
        country: "India"
      }
    ];

    await Food.insertMany(foods);

    res.json({ message: "Foods seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
