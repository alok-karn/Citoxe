const MySqlHelper = require('../config/mysql-db-pool');

exports.getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await MySqlHelper.query('SELECT * FROM plants');

    res.status(200).json({
      status: true,
      message: 'Data sent successfully',
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { title, subTitle, description, price } = req.body;

    if (!title || !subTitle || !description || !price)
      return res.status(400).json({
        status: false,
        message: 'Please provide product title, subTitle, description & price',
      });

    const products = await MySqlHelper.query(
      'SELECT * FROM plants WHERE title = ?',
      [title]
    );

    if (products && products.length > 0)
      return res.status(401).json({
        status: false,
        message:
          'A product with this name already exists, Please use another title.',
      });

    await MySqlHelper.query('INSERT INTO plants SET ?', {
      title: title,
      subTitle: subTitle,
      description: description,
      price: price,
    });

    res.status(201).json({
      status: true,
      message: 'New product created',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        status: false,
        message: 'Invalid product id',
      });

    const products = await MySqlHelper.query(
      'SELECT * FROM plants WHERE id = ?',
      [id]
    );

    if (products && products.length === 0)
      return res.status(404).json({
        status: false,
        message: 'Invalid product id',
      });

    res.status(200).json({
      status: true,
      message: 'Data sent successfully',
      product: products[0],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subTitle, description, price } = req.body;

    if (!id)
      return res.status(400).json({
        status: false,
        message: 'Invalid product id',
      });

    if (!title || !subTitle || !description || !price)
      return res.status(400).json({
        status: false,
        message: 'Please provide product title, subTitle, description & price',
      });

    const products = await MySqlHelper.query(
      'SELECT * FROM plants WHERE id = ?',
      [id]
    );

    if (products && products.length === 0)
      return res.status(404).json({
        status: false,
        message: 'Invalid product id',
      });

    const updatedProduct = await MySqlHelper.query(
      `UPDATE plants SET title=?,subTitle=?,description=?,price=? WHERE id=?`,
      [title, subTitle, description, price, id]
    );

    res.status(200).json({
      status: true,
      message: 'Product updated',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        status: false,
        message: 'Invalid product id',
      });

    const products = await MySqlHelper.query(
      'SELECT * FROM plants WHERE id = ?',
      [id]
    );

    if (products && products.length === 0)
      return res.status(404).json({
        status: false,
        message: 'Invalid product id',
      });

    await MySqlHelper.query('DELETE FROM plants WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Product deleted',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong, please try again later',
    });
  }
};
