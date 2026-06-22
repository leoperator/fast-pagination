const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.static('public'));

app.get('/api/products', async (req, res) => {
  try {
    const { category, cursor, limit = 12 } = req.query;
    const take = parseInt(limit);

    const queryOptions = {
      take: take,
      orderBy: [
        { created_at: 'desc' },
        { id: 'desc' }
      ],
    };

    if (category) {
      queryOptions.where = { category: category };
    }

    if (cursor) {
      queryOptions.cursor = { id: cursor }; 
      queryOptions.skip = 1;
    }

    // Timer start
    console.time('Pagination Query Time');

    const products = await prisma.product.findMany(queryOptions);

    // Timer end
    console.timeEnd('Pagination Query Time');

    let nextCursor = null;
    if (products.length === take) {
      nextCursor = products[products.length - 1].id;
    }

    res.json({
      data: products,
      next_cursor: nextCursor,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));