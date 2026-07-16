import productsData from '../../data/products.json';
import { categories } from '../../data/categories.js';

export function getStaticPaths() {
  return categories.map((c) => ({ params: { category: c.slug } }));
}

export async function GET({ params }) {
  const products = productsData
    .filter((p) => !p.draft && p.category.includes(params.category))
    .map((p) => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      price: p.price,
      old_price: p.old_price,
      image_url: p.image_url,
      affiliate_url: p.affiliate_url,
    }));

  return new Response(JSON.stringify(products), {
    headers: { 'Content-Type': 'application/json' },
  });
}
