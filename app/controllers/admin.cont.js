const { Admin, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Product, Category } = require("../models"); 

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

      console.log("Succesful login");
      console.log("Logged in:", req.session);
      res.redirect("/admin/dashboard");
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
exports.adminDashboard = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.redirect("/admin/admin-login");
    }

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category", 
        },
      ],
    });

    const categoryNames = [];
    const productCounts = [];

    // Aggregate products by category
    products.forEach((product) => {
      const categoryName = product.category.name; 
      const index = categoryNames.indexOf(categoryName);

      if (index === -1) {
        categoryNames.push(categoryName);
        productCounts.push(1); 
      } else {
        productCounts[index] += 1;
      }
    });

    res.render("admin_dashboard", {
      categoryNames,
      productCounts,
      adminName: req.session.adminName,
    });
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    res.status(500).send("Server error");
  }
};

// admin product
exports.adminAllProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    let where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.categoryId = category;
    }

    let order = [];
    if (sort === "price-asc") {
      order.push(["price", "ASC"]);
    } else if (sort === "price-desc") {
      order.push(["price", "DESC"]);
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: "category" }],
      order,
    });

    if (req.xhr) {
      return res.render(
        "partials/admin_products",
        { products },
        (err, html) => {
          if (err) {
            return res.status(500).send("Error rendering partial");
          }
          res.send(html);
        }
      );
    }

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


exports.adminProductsPartial = async (req, res) => {
  const { search, sort, category } = req.query;

  // default
  let queryOptions = {
    where: {},
    include: [
      {
        model: Category,
        as: "category",
      },
    ],
  };

  // searc
  if (search) {
    queryOptions.where.name = { [Op.like]: `%${search}%` };
  }

  // category
  if (category) {
    queryOptions.where.categoryId = category;
  }

  // sorting
  if (sort === "price-asc") {
    queryOptions.order = [["price", "ASC"]];
  } else if (sort === "price-desc") {
    queryOptions.order = [["price", "DESC"]];
  }

  const products = await Product.findAll(queryOptions);

  res.render("partials/admin_products", { products });
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

exports.adminAddProduct = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render("admin_add_product", { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.adminCreateProduct = async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;

    if (!name || !price || !stock || !categoryId) {
      const categories = await Category.findAll(); 
      return res.render("admin/add-product", {
        categories,
        errorMessage: "All fields are required",
      });
    }

    await Product.create({
      name,
      price: parseFloat(price), 
      stock: parseInt(stock, 10), 
      categoryId,
    });

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

// settings
exports.adminSettings = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.redirect("/admin/admin-login");
    }

    const admins = await Admin.findAll({
      include: [
        {
          model: Admin, 
          as: 'creator', 
          attributes: ['name'], 
        },
      ],
      attributes: ['id', 'name', 'email', 'createdById'], // Fields for each admin
    });
    
    const adminName = req.session.adminName; // Admin's name from session
    const currentAdminId = req.session.adminId; // Current admin's ID
    console.log("Admins fetched:", admins);

    res.render("admin_settings", { admins, adminName, currentAdminId });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    res.status(500).send("admin error");
  }
};

exports.adminChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.session.adminId;

  try {
    const admin = await Admin.findByPk(adminId);

    // Check if current password matches
    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
      return res.status(401).send("Current password is incorrect.");
    }

    // Hash the new password and save it
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.redirect("/admin/settings"); // Redirect back to settings
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("change password error");
  }
};

exports.adminDeleteAccount = async (req, res) => {
  const adminId = req.session.adminId;

  try {
    const admin = await Admin.findByPk(adminId);
    if (admin) {
      await admin.destroy();
      req.session.destroy(); // Clear session after deleting account
    }

    res.redirect('/admin/admin-login'); // Redirect to login page after deletion
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send("delete current admin error");
  }
};

exports.adminDelete = async (req, res) => {
  const { adminId } = req.body; // Get the adminId from the request body

  try {
    if (!req.session.adminId) {
      return res.redirect("/admin/admin-login");
    }

    // Prevent deleting the current admin
    if (req.session.adminId === adminId) {
      return res.status(403).send("You cannot delete your own account.");
    }

    const admin = await Admin.findByPk(adminId);
    if (admin) {
      await admin.destroy();
    }

    res.redirect("/admin/settings"); // Redirect after successful deletion
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send("delete admin error");
  }
};

exports.adminAdd = async (req, res) => {
  const { name, email, password, creator } = req.body; // Get the form data

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Optionally log or notify the creator
    console.log(`${creator} added a new admin: ${newAdmin.name}`);

    res.redirect("/admin/settings"); // Redirect after successful addition
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).send("add admin error");
  }
};
