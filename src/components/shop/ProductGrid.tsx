import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const products = [
    {
      image:
        "https://i0.wp.com/www.thecreativenwk.com/wp-content/uploads/2020/07/Nabulsi-Soap.jpg",
      title: "Nabulsi Soap",
      description: "Authentic handmade olive oil soap from Nablus.",
      price: 12,
      badge: "BEST SELLER",
    },
    {
      image:
        "https://oliveoilsfromspain.org/wp-content/uploads/2021/03/What-is-extra-virgin-olive-oil.jpg",
      title: "Virgin Olive Oil",
      description: "Cold-pressed Palestinian olive oil (500ml).",
      price: 45,
      badge: "ORGANIC",
    },
    {
      image:
        "https://cdn.shopify.com/s/files/1/0276/1079/3835/products/oud.png?v=1614333528",
      title: "Arabic Oud Perfume",
      description: "Long-lasting Arabian fragrance.",
      price: 30,
    },
    {
      image:
        "https://www.napolisecrets.com/wp-content/uploads/2023/01/Olive-Oil-Soap-Natural.jpg",
      title: "Olive Oil Soap",
      description: "Pure olive oil moisturizing soap.",
      price: 8,
    },
    {
      image:
        "https://cdn.shopify.com/s/files/1/0250/0351/2813/products/alsur-deep-oud-incense.jpg?v=1645879381",
      title: "Palestinian Bukhoor",
      description: "Traditional incense with rich aroma.",
      price: 25,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p, i) => (
        <ProductCard
          key={i}
          image={p.image}
          title={p.title}
          description={p.description}
          price={p.price}
          badge={p.badge}
          onAddToCart={() => console.log("Add to cart:", p.title)}
          onBuyNow={() => console.log("Buy:", p.title)}
        />
      ))}
    </div>
  );
}
