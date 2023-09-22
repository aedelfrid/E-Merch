const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: { model: Product }
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagID = req.params.id;
    const tagData = await Tag.findByPk(tagID, {
      include: { model: Product }
    });

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;
    const newTag = await Tag.create({
      tag_name: tag_name
    })
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err)
  }
  // create a new tag
});

router.put('/:id', async (req, res) => {
  try {
    const tagID = req.params.id;
    const { tag_name } = req.body;
    const updatedTag = Tag.update({tag_name: tag_name}, {
      where : {
        id:tagID
      }
    })
    res.status(200).json(`Tag name is updated.`);
  } catch (err) {
    res.status(500).json(err)
  }
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagID = req.params.id;
    const deletedTag = Tag.destroy({
      where: {
        id: tagID
      }
    })
    res.status(200).json(`Requested Tag has been deleted.`);
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
