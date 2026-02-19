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
      },
      {
        name: "Veg Noodles",
        description: "A staple dish in Chinese cuisine made from wheat or rice flour. Stir-fried with vegetables, sauces, and sometimes meat, noodles are flavorful and versatile.",
        images: [
        "/images/noodles_1.jpg",
        "/images/noodles_2.jpg",
      ],
        isVeg: false,
        country: "CN"
      },
      {
        name: "Chicken Burger",
        description: "A sandwich consisting of a grilled patty placed inside a bun with lettuce, tomato, cheese, and sauces,meat-based.",
        images: [
        "/images/burger_beef_1.jpg",
        "/images/burger.avif",
      ],
        isVeg: true,
        country: "US"
      },
      {
        name: "Veg Pizza",
        description: "An Italian flatbread topped with tomato sauce, cheese, and various toppings and Chicken",
        images: [
        "/images/veg_pizza_1.jpg",
        "/images/veg_pizza_2.jpg",
      ],
        isVeg: false,
        country: "IT"
      }
    ];

    await Food.insertMany(foods);

    res.json({ message: "Foods seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
