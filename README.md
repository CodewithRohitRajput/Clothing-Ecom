# Fashion Hub - MERN Stack E-Commerce Website

Fashion Hub is a full-featured e-commerce platform for a clothing store, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register, login, profile management)
- Product browsing by categories
- Product search
- Shopping cart functionality
- Checkout process
- Order management
- Admin dashboard for product, order, and user management

## Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5002
   ```

## Running the Application

To run both the server and client concurrently:
```
npm run dev
```

To run only the server:
```
npm run server
```

To run only the client:
```
npm run client
```

## Creating an Admin User

There are two ways to create an admin user:

### Method 1: Using the Seeder Script

Run the following command to create a default admin user:
```
npm run data:import
```

This will create an admin user with the following credentials:
- Email: admin@example.com
- Password: admin123

To remove the seeded admin user:
```
npm run data:destroy
```

### Method 2: Manual Registration and Database Update

1. Register a new user through the application interface
2. Access your MongoDB database (using MongoDB Compass or similar tool)
3. Find the user in the `users` collection
4. Change the `isAdmin` field from `false` to `true`
5. Save the changes
6. Log in with the user's credentials to access admin features

## Admin Features

Once logged in as an admin, you can access the following features:

1. **Product Management**
   - View all products
   - Add new products
   - Edit existing products
   - Delete products

2. **Order Management**
   - View all orders
   - Update order status (Processing, Shipped, Delivered, Cancelled)
   - View order details

3. **User Management**
   - View all users
   - Make users admin or remove admin privileges
   - Delete users

## Technologies Used

- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)

### Cart Routes
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Order Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get logged in user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders` - Get all orders (Admin only)

### User Routes
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## License
This project is licensed under the MIT License.

## Acknowledgements
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/) 