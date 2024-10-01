
const express = require("express");
const router = express.Router();
const adminCont = require("../controllers/admin.cont");

router.get("/admin-login", adminCont.admin);
router.post("/admin-login", adminCont.adminLogin);
router.get('/logout', adminCont.adminLogout);

// dashboard
router.get("/dashboard", adminCont.adminDashboard);

// products routes
router.get('/products', adminCont.adminAllProducts);
router.get('/products/partial', adminCont.adminProductsPartial);

router.get('/products/edit/:id', adminCont.adminProductEdit);

router.post('/products/edit/:id', adminCont.adminProductEditPost);

router.post('/products/delete/:id', adminCont.adminProductDelete);

router.get('/add-product', adminCont.adminAddProduct);

router.post('/add-product', adminCont.adminCreateProduct);

// settings
router.get('/settings', adminCont.adminSettings);

router.post('/settings/change-password', adminCont.adminChangePassword);

router.post('/settings/delete-admin', adminCont.adminDelete);

router.post('/settings/delete-account', adminCont.adminDeleteAccount)

router.post('/settings/add-admin', adminCont.adminAdd);



// router.get('/inventory', adminCont.adminInventory);

module.exports = router;
