const router = require("./auth");
const productController= require('../controllers/product')
router.get("/products/count",productController.getProductsCount)

router.get("/products/:id", productController.getProductDetails)
router.post("/products", (req, res) => {

})

router.put("/products/:id", (req, res) => {

})

router.delete("/products/:id", (req, res) => {

})

module.exports = router