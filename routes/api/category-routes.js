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
    const category = await Category.create(category_name)
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

    res.status(200).json(updatedCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id',async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = Category.delete({
      where: {
        id: categoryID
      }
    });
    res.status(200).json(category)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
