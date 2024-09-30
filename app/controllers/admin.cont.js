const { Admin } = require("../models"); // Adjust the path as needed
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
const { Product, Category } = require("../models"); // Adjust the path

// admin login
exports.admin = (req, res) => {
  if (req.session.adminId) {
    return res.redirect("/admin/dashboard");
  }

  res.render("admin_login");
};

exports.adminLogin = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email);

  try {
    const admin = await Admin.findOne({ where: { email } });
    console.log(admin);

    if (
      admin &&
      admin.name === name &&
      (await bcrypt.compare(password, admin.password))
    ) {
      req.session.adminId = admin.id;
      req.session.adminName = admin.name;

      // Successful login logic (e.g., setting session)
      console.log("Succesful login");
      console.log("Logged in:", req.session); // Log session after login
      res.redirect("/admin/dashboard"); // Redirect to the admin dashboard
    } else {
      res.render("admin_login", { errorMessage: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.render("admin_login", {
      errorMessage: "An error occurred. Please try again.",
    });
  }
};

// dashboard
exports.adminDashboard = (req, res) => {
  if (!req.session.adminId) {
    return res.redirect("/admin/admin-login");
  }

  res.render("admin_dashboard", { adminName: req.session.adminName });
};

// admin product
exports.adminAllProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    let queryOptions = { include: [{ model: Category, as: 'category' }]  };
    

    // Search by product name
    if (search) {
      queryOptions.where = {
        name: { [Op.like]: `%${search}%` },
      };
    }

    // Filter by category
    if (category) {
      queryOptions.where = { ...queryOptions.where, categoryId: category };
    }

    // Sort by price
    if (sort === "price-asc") {
      queryOptions.order = [["price", "ASC"]];
    } else if (sort === "price-desc") {
      queryOptions.order = [["price", "DESC"]];
    }

    const products = await Product.findAll(queryOptions);

    // Fetch all categories for the filter dropdown
    const categories = await Category.findAll();

    res.render("admin_products", {
      products,
      categories,
      search,
      sort,
      selectedCategory: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.adminProductEdit = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    const categories = await Category.findAll();

    res.render("admin_products_edit", { product, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.adminProductEditPost = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    await Product.update(
      { name, description, price, stock, categoryId },
      { where: { id: req.params.id } }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.adminProductDelete = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// logout
exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/admin/dashboard");
    }

    res.redirect("/admin/admin-login");
    console.log("Logout successfully");
  });
};
