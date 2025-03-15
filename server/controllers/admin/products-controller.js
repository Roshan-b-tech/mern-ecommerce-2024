const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const sampleProducts = [
  {
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    title: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt",
    category: "men",
    brand: "nike",
    price: 29.99,
    salePrice: 24.99,
    totalStock: 100,
    averageReview: 4.5
  },
  {
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop",
    title: "Women's Summer Dress",
    description: "Light and stylish summer dress",
    category: "women",
    brand: "zara",
    price: 59.99,
    salePrice: 49.99,
    totalStock: 50,
    averageReview: 4.8
  },
  {
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop",
    title: "Running Shoes",
    description: "Comfortable running shoes",
    category: "footwear",
    brand: "adidas",
    price: 89.99,
    salePrice: 79.99,
    totalStock: 75,
    averageReview: 4.7
  }
];

const handleImageUpload = async (req, res) => {
  try {
    // Log incoming request details
    console.log("Upload request received:", {
      hasFile: !!req.file,
      fileDetails: req.file ? {
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname
      } : null
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Invalid file format"
      });
    }

    // Convert file to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    console.log("Attempting to upload to Cloudinary...");

    try {
      const result = await imageUploadUtil(dataUri);
      console.log("Upload successful:", {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format
      });

      return res.status(200).json({
        success: true,
        result: {
          url: result.secure_url
        }
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: uploadError.message || "Error uploading to Cloudinary"
      });
    }
  } catch (error) {
    console.error("Server error during upload:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during upload"
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    let listOfProducts = await Product.find({});

    // If no products exist, add sample products
    if (listOfProducts.length === 0) {
      await Product.insertMany(sampleProducts);
      listOfProducts = await Product.find({});
    }

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
