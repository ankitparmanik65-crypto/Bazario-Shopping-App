# 🛍️ Bazario — Shop Smart, Live Better

A modern, full-stack e-commerce web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Bazario provides a complete shopping experience with product discovery, image galleries, cart management, wishlist, checkout flow, mock payment, order tracking, admin dashboard, and much more.


## ✨ Features

### 🎨 Frontend Features

#### 🛍️ Product Discovery
- Browse large collection of products
- Product cards with images, prices, and ratings
- Category-based filtering
- **Real-time search with autocomplete suggestions**
- Dynamic product count
- **Load More Products** pagination
- Responsive product grid (2 columns on mobile, 4 on desktop)
- Product-specific images with fallbacks

#### 🔍 Search & Category Filtering
- **Autocomplete search dropdown** with product suggestions
- Search products by name
- Filter products by category
- Search and category filtering work together
- **Keyboard navigation** (Arrow keys, Enter, Escape)
- Click-outside to close dropdown
- Minimum 2 characters for suggestions

#### 📦 Product Details
- **Multi-image gallery** with thumbnails
- **Left/Right navigation arrows** on main image
- **Image counter** (1/4, 2/4, etc.)
- Thumbnail strip for quick image switching
- Product name, price, category, description
- Product rating with star display
- Related products section ("You May Also Like")
- Add to Cart / Buy Now / Add to Wishlist buttons
- Customer reviews section
- **Write a review** with star rating
- Review submission with validation

#### 🖼️ Image Gallery
- Multiple product images
- Main image with previous/next navigation
- Thumbnail strip below main image
- Active thumbnail highlighting
- Image counter display
- Smooth transitions
- Responsive on all screen sizes

#### ❤️ Wishlist
- Add/remove products from wishlist
- Wishlist count in navbar
- Open product directly from wishlist
- Wishlist persisted using localStorage (guest) + API (logged in)
- Wishlist works with product details and related products
- **Beautiful empty state** with animated heart

#### 🛒 Shopping Cart
- Complete cart management system
- Add products to cart
- Increase/decrease quantity
- Remove products
- Automatic quantity updates
- Automatic cart total calculation
- **Cart drawer** (slide from right)
- Empty cart handling
- Cart data saved in localStorage
- Cart remains available after page refresh
- **Free shipping progress bar** (₹5000 threshold)

#### ⚡ Buy Now
- Dedicated Buy Now shopping flow
- Product Details → Buy Now → Checkout → Payment → Order Success
- Buy Now checkout handled separately from normal cart checkout

#### 💳 Checkout
- Complete checkout flow (route-based: `/checkout`)
- Customer information form with validation
- Order summary with product list
- Subtotal calculation
- Shipping calculation (free above ₹5000)
- Final total display
- Cart checkout and Buy Now checkout both supported
- **Auth-protected route** (login required)

#### 💰 Mock Payment
- Simulated payment system for demonstration
- **3 payment methods:**
  - UPI
  - Credit/Debit Card
  - Cash on Delivery (COD)
- Payment flow: Checkout → Payment → Success → Order Created
- **Smart success messages:**
  - COD → "Order Confirmed"
  - UPI/Card → "Payment Successful"
- Form validation for UPI ID, Card number, CVV, Expiry

#### 📦 Order History
- Users can view their previous orders
- Unique Order ID display
- Order date and customer information
- Purchased products with quantities
- Subtotal, shipping charges, and total
- **Order status badge** with color coding
- **Payment status badge** (Paid / Pending / Refunded / Cancelled)
- **Auto-refresh every 10 seconds** when viewing orders
- Manual refresh button

#### 🚚 Order Tracking
- Visual tracking timeline
- 5 stages: Order Placed → Processing → Shipped → Out for Delivery → Delivered
- **Progress animations** on current step
- **Cancel Order button** for early-stage orders
- Cancelled banner with payment refund info
- Status history tracking

#### ⭐ Product Reviews
- Star rating system (1-5)
- Interactive rating selector
- Customer name and review text
- Review submission
- Review list with dates
- Overall product rating (auto-calculated)
- Verified customer badge
- Empty state when no reviews

#### 🌙 Dark / Light Mode
- Polished dark/light theme system
- Theme preference saved in localStorage
- Persists across page reloads
- All pages and components fully styled
- Smooth transitions between themes
- **Toast notifications** styled for both themes

#### 📱 Responsive Design
- Mobile-first approach
- **2-column product grid** on mobile
- 3 columns on tablet
- 4 columns on desktop
- Mobile-optimized navbar
- Responsive cart drawer
- Mobile-friendly checkout and payment
- Touch-friendly buttons
- Bottom navigation on small screens

#### 🔔 Toast Notifications
- **Beautiful toast messages** using `react-hot-toast`
- Success toasts (green) for:
  - Add to cart
  - Add to wishlist
  - Order placed
  - Review added
  - Order cancelled
  - Logout
- Error toasts (red) for:
  - Login required
  - Failed operations
  - API errors
- **Dark mode support**
- Auto-dismiss after 3 seconds

#### 💀 Loading Skeletons
- **Shimmer loading effect** on product grid
- 8 skeleton cards while loading
- Product details skeleton
- **Smooth shimmer animation**
- Dark mode compatible

#### 🗺️ Navigation (React Router)
- **URL-based routing** (not state-based)
- Routes:
  - `/` — Home
  - `/product/:id` — Product Details
  - `/wishlist` — Wishlist
  - `/orders` — Order History (protected)
  - `/checkout` — Checkout (protected)
  - `/payment` — Payment (protected)
  - `/login` — Login
  - `/register` — Register
  - `/admin` — Admin Dashboard (admin-only)
  - `/404` — Not Found
  - `*` — 404 fallback
- **Refresh-safe** — same page on refresh
- **Back/Forward buttons** work
- **Shareable URLs** (deep linking)
- **Browser bookmark** support

#### 🛡️ Protected Routes
- `/orders`, `/checkout`, `/payment` — login required
- `/admin` — admin role required
- **Loading state** while auth is being checked
- Redirect to login with **return URL** preserved
- After login, user is redirected back to original page

#### ⚠️ 404 Page
- Custom **Page Not Found** page
- Animated 404 with floating search icon
- "Go to Homepage" button
- "Go Back" button
- Invalid URLs handled gracefully

#### ⬆️ Scroll to Top
- **Automatic scroll to top** on every route change
- Works with all navigation
- Smooth user experience

#### 🎨 Custom Logo & Branding
- **"B" in Shopping Bag** SVG logo
- Orange gradient matching theme
- Custom favicon
- Consistent branding across app
- Gradient text for brand name

---

### 🔧 Backend Features

#### 🔐 User Authentication
- User registration with validation
- Password hashing with **bcryptjs**
- **JWT-based authentication** (30 days expiry)
- Login with email/password
- Protected routes with middleware
- Role-based access control (user/admin)
- Profile update support

#### 📦 Product Management
- Full CRUD operations (Create, Read, Update, Delete)
- **Admin-only** product creation/editing/deletion
- 194 products from DummyJSON
- **Multiple images per product**
- Category-based filtering
- Price range filtering
- Rating-based filtering
- Search by name and description
- **Pagination** (12 products per page)
- **Sorting** (price, rating, name, newest)
- Stock management

#### ⭐ Reviews API
- Add review (authenticated users only)
- Get product reviews
- Delete review (owner or admin)
- **Auto-calculated product rating** on review add/delete
- Duplicate review prevention (one per user per product)

#### ❤️ Wishlist API
- Add product to wishlist
- Remove product from wishlist
- Get user's wishlist
- Clear entire wishlist
- **Populated product data** in wishlist response

#### 📦 Orders API
- Create new order (authenticated)
- Get user's orders
- Get single order by ID
- Get all orders (admin only)
- **Update order status** (admin)
- **Cancel order** (user, early-stage only)
- **Payment status auto-update:**
  - Paid → Refunded on cancellation
  - Pending → Cancelled on cancellation
  - **Delivered → Paid** (for COD)
- **Stock restoration** on cancellation
- **Order stats** for admin dashboard

#### 💳 Payment Status Logic
- **Card/UPI/Mock** → `Paid` immediately
- **COD** → `Pending` until delivery
- **Cancelled + Paid** → `Refunded`
- **Cancelled + Pending** → `Cancelled`
- **Delivered + Pending** → `Paid`

#### 👑 Admin Dashboard
- **Products Tab:**
  - View all products in table
  - Search products
  - Add new product
  - Edit existing product
  - Delete product
- **Orders Tab:**
  - View all users' orders
  - Filter by status
  - Update order status
  - View customer info
- **Stats Tab:**
  - Total products
  - Total orders
  - Total revenue
  - Average order value
  - Status-wise order breakdown

#### 🛡️ Security Features
- Password hashing
- JWT tokens
- Protected routes
- Role-based access
- **CORS configuration**
- **Error handling middleware**
- Input validation
- MongoDB injection prevention

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React 19 |
| **Frontend Build Tool** | Vite |
| **Frontend Routing** | React Router DOM v6 |
| **Frontend State** | React Hooks + Context API |
| **Frontend Styling** | CSS Modules (component-wise) |
| **Frontend Icons** | Lucide React |
| **Frontend Toasts** | react-hot-toast |
| **Backend** | Node.js + Express |
| **Backend Database** | MongoDB + Mongoose |
| **Backend Auth** | JWT + bcryptjs |
| **Backend Middleware** | Custom (auth, error) |
| **Database** | MongoDB Atlas (Cloud) |
| **Deployment** | Vercel (Frontend) + Render (Backend) |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure
BAZARIO SHOPPING APP/
│
├── Backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── productController.js
│ │ ├── reviewController.js
│ │ ├── wishlistController.js
│ │ └── orderController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Product.js
│ │ ├── Review.js
│ │ ├── Wishlist.js
│ │ └── Order.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── productRoutes.js
│ │ ├── reviewRoutes.js
│ │ ├── wishlistRoutes.js
│ │ └── orderRoutes.js
│ ├── scripts/
│ │ └── fetchAndSeed.js
│ ├── utils/
│ │ └── generateToken.js
│ ├── .env
│ ├── package.json
│ └── server.js
│
├── Frontend/
│ ├── public/
│ │ ├── favicon.svg
│ │ └── logo.svg
│ ├── src/
│ │ ├── api/
│ │ │ └── axios.js
│ │ ├── components/
│ │ │ ├── Cart.jsx
│ │ │ ├── Checkout.jsx
│ │ │ ├── Logo.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── NotFound.jsx
│ │ │ ├── OrderHistory.jsx
│ │ │ ├── OrderSuccess.jsx
│ │ │ ├── PaymentPage.jsx
│ │ │ ├── ProductCard.jsx
│ │ │ ├── ProductDetails.jsx
│ │ │ ├── ProductSkeleton.jsx
│ │ │ ├── ProtectedRoute.jsx
│ │ │ ├── ScrollToTop.jsx
│ │ │ ├── SearchAutocomplete.jsx
│ │ │ └── Wishlist.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── pages/
│ │ │ ├── Admin/
│ │ │ │ ├── AdminDashboard.jsx
│ │ │ │ ├── AdminProducts.jsx
│ │ │ │ ├── AdminProductForm.jsx
│ │ │ │ ├── AdminOrders.jsx
│ │ │ │ ├── AdminStats.jsx
│ │ │ │ └── Admin.css
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── Auth.css
│ │ ├── services/
│ │ │ ├── authService.js
│ │ │ ├── productService.js
│ │ │ ├── reviewService.js
│ │ │ ├── wishlistService.js
│ │ │ └── orderService.js
│ │ ├── styles/
│ │ │ ├── variables.css
│ │ │ ├── global.css
│ │ │ └── utilities.css
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── main.jsx
│ ├── .env
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
└── README.md


🛒 Complete User Flow
┌─────────────────────┐
│   Product List      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Search / Categories │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Product Details    │  ← Image Gallery + Reviews
└──────────┬──────────┘
           ↓
   ┌───────┼───────┐
   ↓       ↓       ↓
Add to  Buy Now  Wishlist
Cart      ↓
   ↓      ↓
 Cart  Checkout (Route: /checkout)
   ↓      ↓
   └──┬───┘
      ↓
   Payment (Route: /payment)
      ↓
   COD / UPI / Card
      ↓
   Order Success
      ↓
   Order History (Route: /orders)
      ↓
   Order Tracking (Cancel option)



🎯 What's Been Built (Feature Log)

---

## 🎯 What's Been Built (Feature Log)

### Phase 1: Foundation
✅ React + Vite frontend setup

✅ Node.js + Express backend setup

✅ MongoDB connection

✅ User model, Product model

### Phase 2: Authentication
✅ Register / Login with JWT

✅ Password hashing (bcryptjs)

✅ Auth middleware

✅ Role-based access (user/admin)

✅ Auth Context in frontend

✅ Login/Register pages with error handling

### Phase 3: Products
✅ Products API (CRUD, filter, search, pagination)

✅ 194 products from DummyJSON

✅ Products listing page

✅ Category filters

✅ Search functionality

✅ Product cards with images

✅ Load More pagination

### Phase 4: Product Details
✅ Product details page

✅ Related products

✅ Smart back navigation (scroll position preserved)

### Phase 5: Cart
✅ Cart management (add/remove/quantity)

✅ Cart drawer

✅ Cart persistence in localStorage

✅ Free shipping progress bar

✅ Cart totals

### Phase 6: Wishlist
✅ Wishlist API

✅ Wishlist state management

✅ Guest fallback (localStorage)

✅ Wishlist page redesign with animations

### Phase 7: Reviews
✅ Reviews API

✅ Auto-calculated product rating

✅ Write review form

✅ Review list with dates

✅ Star ratings

### Phase 8: Checkout & Payment
✅ Checkout page with form validation

✅ Mock payment system (COD/UPI/Card)

✅ Payment success screen

✅ Order creation API

### Phase 9: Orders
✅ Order History page

✅ Order tracking timeline

✅ Order status updates (admin)

✅ Cancel Order feature

✅ Payment status logic (Paid/Pending/Refunded/Cancelled)

✅ COD auto-paid on delivery

### Phase 10: Admin Panel
✅ Admin Dashboard with tabs

✅ Products management (CRUD)

✅ Orders management

✅ Stats dashboard

✅ Admin-only routes

✅ Admin button in navbar

### Phase 11: UX Improvements
✅ Dark / Light mode

✅ Amazon-style guest checkout flow

✅ Login redirect with return URL

✅ Fixed 401 error handling in login

✅ Mobile responsive (2-column products)

✅ Toast notifications

✅ Loading skeletons

✅ Scroll to top on route change

### Phase 12: Branding
✅ Custom "B in Bag" SVG logo

✅ Custom favicon

✅ Gradient text for brand

### Phase 13: Routing (React Router)
✅ Full migration from state-based to URL-based routing

✅ Protected routes with loading state

✅ 404 Not Found page

✅ Refresh-safe navigation

✅ Browser back/forward support

✅ Shareable URLs (deep linking)

### Phase 14: Search & Discovery
✅ Search autocomplete with dropdown

✅ Keyboard navigation (arrow keys, Enter, Escape)

✅ Product images in suggestions

✅ Click-outside to close

### Phase 15: Image Gallery
✅ Multi-image product gallery

✅ Thumbnail strip

✅ Left/right navigation arrows

✅ Image counter (1/4, 2/4, etc.)

✅ Active thumbnail highlighting

### Phase 16: Coupon & Discount System
✅ Coupon model & API

✅ Admin coupon management (CRUD + toggle)

✅ Available coupons public API

✅ Validate coupon with subtotal

✅ **View Available Coupons modal**

✅ **Click to auto-apply coupon**

✅ **Manual coupon code entry**

✅ **Real-time discount calculation**

✅ **Eligibility check with "Add ₹XXX more" message**

✅ **Save amount preview**

✅ **One use per user per coupon**

✅ **Usage limit tracking**

✅ **Expiry date support**

✅ **Discount shown in order summary**

✅ **Coupon data saved in order**

### Phase 17: User-Specific Cart
✅ **Separate cart per user** (`cart_<userId>` key in localStorage)

✅ **Guest cart** (`cart_guest` key)

✅ **Guest cart migration on login** with toast notification

✅ **Cart reload on user change**

✅ **Cart persists per user across sessions**

### Phase 18: Cart Product Navigation
✅ **Click product image in cart → opens product details page**

✅ **Click product name in cart → opens product details page**

✅ **Auto-close cart drawer on product click**

✅ **Hover effect on clickable products** (scale, color change)

✅ **Mobile tap feedback**

### Phase 19: Recent Fixes & Improvements
✅ **CORS configured** for Vercel production URL

✅ **Backend deployed on Render** with MongoDB Atlas

✅ **Frontend deployed on Vercel** with proper environment variables

✅ **Images array passed** in all product data (ProductPage, loadProducts, fetchWishlist)

✅ **Cart drawer cleanup** on checkout flow

✅ **Preventing duplicate cart items** when adding same product

---

