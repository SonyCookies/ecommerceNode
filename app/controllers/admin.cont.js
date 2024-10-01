const { Admin } = require("../models"); // Adjust the path as needed
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
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

    // Build the query filters
    let where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.categoryId = category;
    }

    // Determine sorting
    let order = [];
    if (sort === 'price-asc') {
      order.push(['price', 'ASC']);
    } else if (sort === 'price-desc') {
      order.push(['price', 'DESC']);
    }

    // Fetch products with optional filters
    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order,
    });

    // If the request is AJAX, return only the table partial
    if (req.xhr) {
      return res.render('partials/admin_products', { products }, (err, html) => {
        if (err) {
          return res.status(500).send('Error rendering partial');
        }
        res.send(html); // Send the rendered partial HTML
      });
    }

    // Otherwise, render the full page with the partial included
    const categories = await Category.findAll();
    res.render('admin_products', { products, categories, search, sort, selectedCategory: category });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
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

exports.adminAddProduct = async (req, res) => {
  try {
    const categories = await Category.findAll(); // Fetch categories for dropdown
    res.render('admin_add_product', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.adminCreateProduct = async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;

    if (!name || !price || !stock || !categoryId) {
      // return res.status(400).send('All fields are required');
      const categories = await Category.findAll(); // Fetch categories again
      return res.render('admin/add-product', {
        categories,
        errorMessage: 'All fields are required',
      });
    }

    await Product.create({
      name,
      price: parseFloat(price), // Convert price to a number
      stock: parseInt(stock, 10), // Convert stock to an integer
      categoryId
    });

    res.redirect('/admin/products'); // Redirect to the products list page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
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
