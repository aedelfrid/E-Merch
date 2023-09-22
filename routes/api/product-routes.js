const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const productData = await Product.findByPk(id, {
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, category_id, tag_ids } = req.body;
    const product = await Product.create({
      product_name: product_name,
      price: price,
      stock: stock,
      category_id: category_id
    });

    if (tag_ids.length) {
      const productTagIdArr = tag_ids.map((tag_ids) => {
        return {
          product_id: product.id,
          tag_id: tag_ids,
        };
      });

      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json({ product, productTagIds });
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const productID = req.params.id;
    const deletedProduct = await Product.destroy({
      where: {
        id: productID
      }

    })
    const deletedProdTags = await ProductTag.destroy({
      where: {
        product_id: productID
      }
    })
    res.status(200).json(`Requested Productand Product Tags have been deleted.`)
  } catch (err) {
    res.status(400).json(err);
  }

});

module.exports = router;
