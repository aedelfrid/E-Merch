const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product}]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id',async (req, res) => {
  try {
  const id = req.params.id;
  const categoryData = await Category.findByPk(id, {
    include: [{ model: Product}]
  })
  res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/',async (req, res) => {
  try {
    const { category_name } = req.body;
    const category = await Category.create({category_name:category_name})
    res.status(200).json(category)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id',async (req, res) => {
  try {
    const categoryID = req.params.id;
    const { category_name } = req.body;

    const category = await Category.update({
      category_name: category_name
    },
    {
      where: {
        id: categoryID
      }
    });

    res.status(200).json(`Category Updated`)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id',async (req, res) => {
  try {
    const categoryID = req.params.id;
    Category.destroy({
      where: {
        id: categoryID
      }
    });
    res.status(200).json(`Category deleted`)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
