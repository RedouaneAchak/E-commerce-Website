import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="el-wrapper">
      <div className="box-up">
        <img className="img" src={product.image} alt={product.name} />

        <div className="img-info">
          <div className="info-inner">
            <span className="p-name">{product.name}</span>
            <span className="p-company">{product.brand}</span>
          </div>

          {product.sizes && (
            <div className="a-size">
              Available sizes : <span className="size">{product.sizes.join(" , ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="box-down">
        <div className="h-bg">
          <div className="h-bg-inner"></div>
        </div>

        <button className="cart" onClick={() => console.log("Add to cart:", product)}>
          <span className="price">${product.price}</span>
          <span className="add-to-cart">
            <span className="txt">Add in cart</span>
          </span>
        </button>
      </div>
    </div>
  );
}
