const productData = [{
    id: 1,
    title: 'shoes',
    description: 'Descripción del producto 1.',
    price: 25.00,
    image: '/3 proyecto shop/IMG/H777b599c677c482b94a6b5a26c145e2cO.jpg_220x220xz.jpg',
    category: 'clothing'
  },
  {
    id: 2,
    title: 'Producto 2',
    description: 'Descripción del producto 2.',
    price: 50.00,
    image: '/3 proyecto shop/IMG/H57f26ce66a794658a41f5ca9229d50aes.jpg_220x220xz.jpg',
    category: 'shoes'
  },
  {
    id: 3,
    title: 'Producto 3',
    description: 'Descripción del producto 3.',
    price: 75.00,
    image: 'https://source.unsplash.com/random/200x200?product3',
    category: 'accessories'
  },
  {
    id: 4,
    title: 'Producto 4',
    description: 'Descripción del producto 4.',
    price: 100.00,
    image: 'https://source.unsplash.com/random/200x200?product4',
    category: 'clothing'
  },
  {
    id: 5,
    title: 'Producto 5',
    description: 'Descripción del producto 5.',
    price: 125.00,
    image: 'https://source.unsplash.com/random/200x200?product5',
    category: 'makeup'
  },
  {
    id: 6,
    title: 'Producto 6',
    description: 'Descripción del producto 6.',
    price: 150.00,
    image: 'https://source.unsplash.com/random/200x200?product6',
    category: 'cellphones'
  },
  {
    id: 7,
    title: 'Producto 7',
    description: 'Descripción del producto 7.',
    price: 175.00,
    image: 'https://source.unsplash.com/random/200x200?product7',
    category: 'clothing'
  },
  {
    id: 8,
    title: 'Producto 8',
    description: 'Descripción del producto 8.',
    price: 200.00,
    image: 'https://source.unsplash.com/random/200x200?product8',
    category: 'shoes'
  },
  {
    id: 9,
    title: 'Producto 9',
    description: 'Descripción del producto 9.',
    price: 225.00,
    image: 'https://source.unsplash.com/random/200x200?product9',
    category: 'accessories'
  },
  {
    id: 10,
    title: 'Producto 10',
    description: 'Descripción del producto 10.',
    price: 250.00,
    image: 'https://source.unsplash.com/random/200x200?product10',
    category: 'makeup'
  }
];

export async function getProducts(page, perPage) {
  return new Promise((resolve) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const products = productData.slice(start, end);
    setTimeout(() => {
      resolve(products);
    }, 200);
  });
}