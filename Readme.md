# PayFlow – Payment Gateway System

PayFlow is a full-stack **Payment Gateway System** built using:

- Frontend: React (JavaScript + CSS)
- Backend: Spring Boot (Java)
- Database: MySQL
- Payment Integration: Razorpay
- Security: JWT Authentication + Spring Security

It simulates a real-world payment processing system with order creation, payment initiation, Razorpay checkout, and payment verification.

---

# 🚀 Features

## Authentication
- User Registration
- Login with JWT
- Secure protected routes
- Logout

## Order Management
- Create Order
- View Orders
- Order Details

## Payment System
- Initiate Payment
- Razorpay Checkout Integration
- Payment Verification (signature validation)
- Payment Retry / Cancel
- Payment History

## Security
- JWT-based authentication
- Spring Security protection
- Role-based access ready structure
- CORS configured for frontend

---

# 🧱 System Architecture


Frontend (React)
↓
REST APIs (Spring Boot)
↓
Order Service + Payment Service
↓
Razorpay Payment Gateway
↓
Payment Verification (Signature Check)
↓
Database (MySQL)


---

# 🖥️ Frontend (PayFlow UI)

React-based frontend with very simple UI focused on functionality.

## 📁 Structure


src/
├── api.jsx
├── index.js
├── index.css
├── App.jsx
│
├── context/
│ └── AuthContext.js
│
├── components/
│ ├── Sidebar.jsx
│ ├── Badge.jsx
│
└── pages/
├── LoginPage.jsx
├── RegisterPage.jsx
├── Dashboard.jsx
├── CreateOrderPage.jsx
├── OrdersPage.jsx
├── OrderDetailPage.jsx
├── PaymentsPage.jsx
├── PaymentDetailPage.jsx
├── PaymentSuccessPage.jsx


---

## 🔌 Frontend API Usage

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | User registration |
| POST | /auth/login | Login |
| GET | /orders/user/{id} | Fetch user orders |
| POST | /orders/buy | Create order |
| POST | /payments/pay | Initiate payment |
| POST | /payments/verify | Verify Razorpay payment |
| POST | /payments/cancel/{orderNumber} | Cancel payment |
| GET | /payments/getById/{paymentId} | Payment details |

---

## ▶️ Run Frontend

```bash
npm install
npm start

Frontend runs at:

http://localhost:3000


⚙️ Backend (Spring Boot – PayFlow API)
📁 Core Modules
1. Auth Module
Register user
Login user
JWT token generation
Password encryption (BCrypt)
2. Order Module
Create order
Fetch orders by user
Get order details

2.Order Module:
orderNumber
amount
status (CREATED / PAID / FAILED)

3. Payment Module
Create payment request
Generate Razorpay order
Store gatewayOrderId
Verify payment using signature
Update payment status


💳 Razorpay Flow
1. Frontend sends order → Backend
2. Backend creates Razorpay order
3. Razorpay returns gatewayOrderId
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay returns:
   - razorpay_order_id
   - razorpay_payment_id
   - razorpay_signature
7. Backend verifies signature
8. Payment marked SUCCESS


🔐 Payment Status Flow
CREATED → PROCESSING → SUCCEED
                     → FAILED
                     → CANCELLED


🗄️ Database Tables
Users
id
name
email
password
Orders
id
orderNumber
amount
status
user_id
Payments
id
paymentId
gatewayOrderId
gatewayPaymentId
status
amount
order_id
user_id


🔒 Security Configuration
JWT Authentication Filter
Spring Security Config
Password encryption using BCrypt
CORS enabled for frontend


🌐 CORS Configuration
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);
    return source;
}


🧪 Testing Flow
Register User
Login
Create Order
Initiate Payment
Razorpay Checkout (Test Mode)
Verify Payment
Check Payment History

📌 Tech Stack
Frontend
React
Axios
JavaScript
CSS
Backend
Spring Boot
Spring Security
JWT
JPA/Hibernate
Database
MySQL
Payment Gateway
Razorpay (Test Mode)

🎯 Project Goal
This project demonstrates:

Real-world payment gateway integration
Secure backend architecture
Order-payment lifecycle
Razorpay signature verification
Full-stack system design

🚀 Author
Built as a Full Stack Payment Gateway System using Spring Boot + React + Razorpay Integration.