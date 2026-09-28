import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import productService from "./services/productService";
import wishlistService from "./services/wishlistService";
import reviewService from "./services/reviewService";
import orderService from "./services/orderService";

import ProductCard from "./components/ProductCard";
import ProductSkeleton from "./components/ProductSkeleton";
import ProductDetails from "./components/ProductDetails";
import SearchAutocomplete from "./components/SearchAutocomplete";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Checkout from "./components/Checkout";
import PaymentPage from "./components/PaymentPage";
import OrderSuccess from "./components/OrderSuccess";
import OrderHistory from "./components/OrderHistory";
import Wishlist from "./components/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

// ═══════════════════════════════════════
// CART HELPER — User-specific cart key
// ═══════════════════════════════════════

const getCartKey = (userId) => {
  return userId ? `cart_${userId}` : "cart_guest";
};

// ═══════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════

function HomePage({
  products,
  productsLoading,
  productsError,
  filteredProducts,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  hasMoreProducts,
  setPage,
  addToCart,
  onBuyNow,
  wishlist,
  addToWishlist,
  removeFromWishlist,
}) {
  const navigate = useNavigate();
  const handleProductClick = (product) => navigate(`/product/${product.id}`);

  return (
    <main className="container">
      <div className="page-title">
        <h1>Discover Our Products</h1>
        <p>Find something you'll love.</p>
      </div>

      <SearchAutocomplete
        products={products}
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search products..."
      />

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-count">
        Showing {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
      </div>

      <div className="product-grid">
        {productsLoading && products.length === 0 ? (
          <>
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </>
        ) : productsError ? (
          <div className="no-products">
            <h2>Something went wrong</h2>
            <p>{productsError}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              onProductClick={handleProductClick}
              onBuyNow={onBuyNow}
              wishlist={wishlist}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
            />
          ))
        ) : (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try searching for something else.</p>
          </div>
        )}
      </div>

      {!searchTerm && hasMoreProducts && !productsLoading && (
        <div className="load-more-container">
          <button
            className="load-more-button"
            onClick={() => setPage((p) => p + 1)}
          >
            Load More Products
          </button>
        </div>
      )}

      {productsLoading && products.length > 0 && (
        <p className="loading-more">Loading more products...</p>
      )}
    </main>
  );
}

// ═══════════════════════════════════════
// PRODUCT PAGE
// ═══════════════════════════════════════

function ProductPage({
  products,
  addToCart,
  onBuyNow,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  getProductReviews,
  addReview,
  deleteReview,
  isAuthenticated,
  user,
  isAdmin,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct({
          id: data._id,
          _id: data._id,
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image,
          images: data.images || [],
          description: data.description,
          rating: data.rating,
          numReviews: data.numReviews || 0,
        });
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !products.length) return;
    const sameCategory = products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    setRelatedProducts(sameCategory);
  }, [product, products]);

  if (loading) {
    return (
      <main className="container">
        <div className="product-details-page">
          <button className="back-button" disabled>
            ← Back to Products
          </button>
          <div className="product-details-card">
            <div
              className="shimmer"
              style={{
                width: "100%",
                height: "380px",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "10px 0",
              }}
            >
              <div
                className="shimmer"
                style={{ height: "20px", width: "40%", borderRadius: "6px" }}
              />
              <div
                className="shimmer"
                style={{ height: "36px", width: "80%", borderRadius: "6px" }}
              />
              <div
                className="shimmer"
                style={{ height: "24px", width: "30%", borderRadius: "6px" }}
              />
              <div
                className="shimmer"
                style={{ height: "70px", borderRadius: "6px" }}
              />
              <div
                className="shimmer"
                style={{ height: "50px", borderRadius: "10px" }}
              />
              <div
                className="shimmer"
                style={{ height: "50px", borderRadius: "10px" }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  return (
    <main className="container">
      <ProductDetails
        product={product}
        addToCart={addToCart}
        onBuyNow={onBuyNow}
        onBack={() => navigate(-1)}
        wishlist={wishlist}
        addToWishlist={addToWishlist}
        removeFromWishlist={removeFromWishlist}
        reviews={getProductReviews(product.id)}
        addReview={addReview}
        deleteReview={deleteReview}
        isAuthenticated={isAuthenticated}
        currentUserId={user?._id}
        isAdmin={isAdmin}
      />

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-products-header">
            <h2>You May Also Like</h2>
            <p>More products from {product.category}</p>
          </div>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                onProductClick={() => navigate(`/product/${p.id}`)}
                onBuyNow={onBuyNow}
                wishlist={wishlist}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════

function App() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingCheckout, setPendingCheckout] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const PRODUCTS_PER_LOAD = 50;

  // ⭐ USER-SPECIFIC CART INITIALIZATION
  const [cart, setCart] = useState(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("bazario_user") || "null"
    );
    const cartKey = getCartKey(storedUser?._id);
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [checkoutCart, setCheckoutCart] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviews, setReviews] = useState({});

  // ═══ Wishlist ═══
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        const savedWishlist = localStorage.getItem("guest_wishlist");
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
        return;
      }
      try {
        setWishlistLoading(true);
        const data = await wishlistService.getWishlist();
        const formattedWishlist = (data.products || []).map((product) => ({
          id: product._id,
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images || [],
          description: product.description,
          rating: product.rating,
          numReviews: product.numReviews || 0,
        }));
        setWishlist(formattedWishlist);
      } catch (error) {
        console.error("Wishlist fetch error:", error);
      } finally {
        setWishlistLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const wishlistCount = wishlist.length;

  // ═══ Reviews ═══
  const getProductReviews = (productId) => reviews[productId] || [];

  const fetchProductReviews = async (productId) => {
    try {
      const data = await reviewService.getProductReviews(productId);
      const formattedReviews = data.map((review) => ({
        id: review._id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString("en-IN"),
        userId: review.user?._id || review.user,
      }));
      setReviews((current) => ({ ...current, [productId]: formattedReviews }));
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };

  const addReview = async (productId, reviewData) => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }
    try {
      const newReview = await reviewService.createReview(productId, {
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      const formattedReview = {
        id: newReview._id,
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date(newReview.createdAt).toLocaleDateString("en-IN"),
        userId: newReview.user,
      };
      setReviews((current) => ({
        ...current,
        [productId]: [formattedReview, ...(current[productId] || [])],
      }));
      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p.id === productId
            ? { ...p, numReviews: (p.numReviews || 0) + 1 }
            : p
        )
      );
      toast.success("Review added successfully! ⭐");
    } catch (error) {
      console.error("Add review error:", error);
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  };

  const deleteReview = async (productId, reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((current) => ({
        ...current,
        [productId]: (current[productId] || []).filter(
          (review) => review.id !== reviewId
        ),
      }));
      toast.success("Review deleted");
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  // ═══ Dark mode ═══
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // ═══ Load products ═══
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");
        const response = await productService.getProducts({
          page,
          limit: PRODUCTS_PER_LOAD,
        });
        const formattedProducts = response.data.map((product) => ({
          id: product._id,
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images || [],
          description: product.description,
          rating: product.rating,
          numReviews: product.numReviews || 0,
        }));
        setProducts((currentProducts) => {
          const existingIds = new Set(currentProducts.map((p) => p.id));
          const newProducts = formattedProducts.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...currentProducts, ...newProducts];
        });
        setHasMoreProducts(page < response.pages);
      } catch (error) {
        console.error("Product loading error:", error);
        setProductsError("Unable to load products. Please try again later.");
        toast.error("Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, [page]);

  // ⭐ USER-SPECIFIC CART SAVE
  useEffect(() => {
    const cartKey = getCartKey(user?._id);
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, user?._id]);

  // ⭐ CART RELOAD ON USER CHANGE (login/logout)
  useEffect(() => {
    const cartKey = getCartKey(user?._id);
    const savedCart = localStorage.getItem(cartKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user?._id]);

  // ⭐ GUEST CART MIGRATION ON LOGIN
  useEffect(() => {
    if (!user?._id) return;

    const guestCartKey = "cart_guest";
    const userCartKey = `cart_${user._id}`;

    const guestCart = localStorage.getItem(guestCartKey);
    const userCart = localStorage.getItem(userCartKey);

    if (guestCart && !userCart) {
      try {
        const guestCartData = JSON.parse(guestCart);
        if (guestCartData && guestCartData.length > 0) {
          localStorage.setItem(userCartKey, guestCart);
          localStorage.removeItem(guestCartKey);
          setCart(guestCartData);
          toast.success("Your cart has been saved! 🛒");
        }
      } catch (error) {
        console.error("Cart migration error:", error);
      }
    }
  }, [user?._id]);

  // ═══ Fetch orders ═══
  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    try {
      if (isAdmin) {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } else {
        const data = await orderService.getMyOrders();
        setOrders(data);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, user?._id]);

  // ═══ Pending checkout ═══
  useEffect(() => {
    if (isAuthenticated && pendingCheckout && checkoutCart.length > 0) {
      setIsCartOpen(false);
      setPendingCheckout(false);
      navigate("/checkout");
    }
  }, [isAuthenticated, pendingCheckout, checkoutCart, navigate]);

  // ═══ Derived ═══
  const cartCount = cart.length;
  const checkoutTotal = checkoutCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ═══ Cart handlers ═══
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  // ═══ Wishlist handlers ═══
  const addToWishlist = async (product) => {
    const alreadyExists = wishlist.some((item) => item.id === product.id);
    if (alreadyExists) return;
    setWishlist((current) => [...current, product]);
    toast.success(`${product.name} added to wishlist! ❤️`);
    if (isAuthenticated) {
      try {
        await wishlistService.addToWishlist(product.id);
      } catch (error) {
        console.error("Add to wishlist error:", error);
        setWishlist((current) =>
          current.filter((item) => item.id !== product.id)
        );
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const removeFromWishlist = async (id) => {
    const removedItem = wishlist.find((item) => item.id === id);
    setWishlist((current) => current.filter((item) => item.id !== id));
    toast.success("Removed from wishlist");
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(id);
      } catch (error) {
        console.error("Remove from wishlist error:", error);
        if (removedItem) {
          setWishlist((current) => [...current, removedItem]);
        }
        toast.error("Failed to remove from wishlist");
      }
    }
  };

  // ═══ Buy Now / Checkout ═══
  const handleBuyNow = (product) => {
    const buyNowItem = { ...product, quantity: 1 };
    if (!isAuthenticated) {
      setCheckoutCart([buyNowItem]);
      setIsBuyNow(true);
      setPendingCheckout(true);
      setIsCartOpen(false);
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    setCheckoutCart([buyNowItem]);
    setIsBuyNow(true);
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    if (!isAuthenticated) {
      setCheckoutCart(cart);
      setIsBuyNow(false);
      setPendingCheckout(true);
      setIsCartOpen(false);
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    setCheckoutCart(cart);
    setIsBuyNow(false);
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleProceedToPayment = (customerData) => {
    setPendingCustomer(customerData);
    navigate("/payment");
  };

  const handlePaymentSuccess = (paymentId, paymentMethod) => {
    console.log("✅ Payment:", paymentId, "| Method:", paymentMethod);
    handleOrderPlaced(pendingCustomer, paymentMethod);
  };

  const handleOrderPlaced = async (customerData, paymentMethod = "Mock") => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      return;
    }
    try {
      const orderItems = checkoutCart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const createdOrder = await orderService.createOrder({
        items: orderItems,
        shippingAddress: {
          fullName: customerData.name,
          phone: customerData.phone,
          street: customerData.address,
          city: customerData.city,
          state: customerData.state || "N/A",
          pincode: customerData.pincode,
          country: "India",
        },
        paymentMethod: paymentMethod,
        couponCode: customerData?.couponCode || null,
      });

      setOrders((currentOrders) => [createdOrder, ...currentOrders]);
      setOrder(createdOrder);
      if (!isBuyNow) setCart([]);
      setIsCartOpen(false);
      setPendingCustomer(null);
      setCheckoutCart([]);
      setIsBuyNow(false);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      console.error("Order create error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        newStatus
      );
      setOrders((currentOrders) =>
        currentOrders.map((o) => (o._id === orderId ? updatedOrder : o))
      );
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;
    try {
      const cancelledOrder = await orderService.cancelOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.map((o) => (o._id === orderId ? cancelledOrder : o))
      );
      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel order. Please try again."
      );
    }
  };

  const handleLogout = () => {
    logout();
    setPendingCheckout(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleContinueShopping = () => {
    setOrder(null);
    setCheckoutCart([]);
    setIsBuyNow(false);
    setSearchTerm("");
    setSelectedCategory("All");
    setPendingCheckout(false);
    navigate("/");
  };

  const handleAdminBack = () => {
    setPage(1);
    setProducts([]);
    navigate("/");
  };

  // ⭐ CART PRODUCT CLICK HANDLER
  const handleCartProductClick = (item) => {
    setIsCartOpen(false); // Cart drawer close karo
    navigate(`/product/${item.id}`); // Product details page pe jao
  };

  // ═══ ORDER SUCCESS FULLSCREEN ═══
  if (order) {
    return (
      <div className="app">
        <OrderSuccess order={order} onContinue={handleContinueShopping} />
      </div>
    );
  }

  // ═══ MAIN RENDER ═══
  return (
    <div className="app">
      <ScrollToTop />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "var(--shadow-lg)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode((prev) => !prev)}
        onCartClick={() => setIsCartOpen((prev) => !prev)}
        user={user}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
              filteredProducts={filteredProducts}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              hasMoreProducts={hasMoreProducts}
              setPage={setPage}
              addToCart={addToCart}
              onBuyNow={handleBuyNow}
              wishlist={wishlist}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductPage
              products={products}
              addToCart={addToCart}
              onBuyNow={handleBuyNow}
              wishlist={wishlist}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              getProductReviews={getProductReviews}
              addReview={addReview}
              deleteReview={deleteReview}
              isAuthenticated={isAuthenticated}
              user={user}
              isAdmin={isAdmin}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              onProductClick={(p) => navigate(`/product/${p.id}`)}
              onBack={() => navigate("/")}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout
                cart={checkoutCart}
                onClose={() => {
                  setCheckoutCart([]);
                  setIsBuyNow(false);
                  navigate(-1);
                }}
                onOrderPlaced={handleProceedToPayment}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage
                amount={checkoutTotal}
                orderItems={checkoutCart.map((item) => ({
                  name: item.name,
                  qty: item.quantity,
                  price: item.price * item.quantity,
                }))}
                onSuccess={handlePaymentSuccess}
                onBack={() => navigate("/checkout")}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory
                orders={orders}
                onBack={() => navigate("/")}
                updateOrderStatus={updateOrderStatus}
                onCancelOrder={handleCancelOrder}
                isAdmin={isAdmin}
                onRefresh={fetchOrders}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard onBack={handleAdminBack} />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h2>🛒 Your Cart</h2>
              <button
                className="close-cart"
                onClick={() => setIsCartOpen(false)}
              >
                ✕
              </button>
            </div>
            <Cart
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
              onCheckout={handleCartCheckout}
              isAuthenticated={isAuthenticated}
              onProductClick={handleCartProductClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;