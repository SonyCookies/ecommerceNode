
const express = require("express");
const router = express.Router();
const adminCont = require("../controllers/admin.cont");

router.get("/admin-login", adminCont.admin);
router.post("/admin-login", adminCont.adminLogin);
router.get("/dashboard", adminCont.adminDashboard);
router.get('/logout', adminCont.adminLogout);

// products routes
router.get('/products', adminCont.adminAllProducts);

router.get('/products/edit/:id', adminCont.adminProductEdit);

router.post('/products/edit/:id', adminCont.adminProductEditPost);

router.post('/products/delete/:id', adminCont.adminProductDelete);

// undefined

// router.get('/inventory', adminCont.adminInventory);
// router.get('/settings', adminCont.adminSettings);

module.exports = router;
