# OtakuBase API

OtakuBase is an anime-related platform offering API services for anime listings, reviews, and ratings. It allows users to search for anime information, rate them, and leave reviews. The project is designed using the MERN stack and offers a RESTful API for integration with front-end applications.

## Features

- Fetch anime details including description, genre, and rating.
- Add, update, and delete anime reviews.
- User authentication with JWT tokens.
- Admin and user roles for managing content.
- Upload anime posters to Cloudinary.

## Installation and Setup

### Prerequisites

- Node.js (>= 14.x)
- MongoDB
- Cloudinary Account (for image uploads)

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/otakuBase-api.git
   cd OtakuBase

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Create a .env file in the root directory with the following variables:

```bash
PORT=your_port_number
DB_URL=your_mongo_connection_string
TOKENSECRETKEY=your_jwt_secret_key
TOKENEXPIRY=your_jwt_token_expiry_duration
CLOUDNAME=your_cloudinary_cloud_name
CLOUDAPIKEY=your_cloudinary_api_key
CLOUDAPISECRET=your_cloudinary_api_secret

```

4. Start the development server:

```bash
npm run dev
```

This will start the API on http://localhost:<Your_Port_Number>

## API Endpoints

### Authentication

- **POST** `/api/auth/register`  
  Register a new user/Admin and get a JWT token.

- **POST** `/api/auth/login`  
  Login and get a JWT token.

- **POST** `/api/auth/logout`  
  Logout and removes the JWT token.

### Anime

- **GET** `/api/anime/:animeid`  
  Fetch details of a specific anime .

- **GET** `/api/anime/anime/?sortBy=release_Year&sortOrder=asc&limit=5`  
  Fetch details of all animes along with searching,sorting,pagination,limit(no.of animes).

- **GET** `/api/anime/:animeid/allreviews`  
  Fetch details of all the reviews for a specific anime .

- **POST** `api/anime/:animeid/newReview`  
  Add a review for a specific anime.

- **PUT** `/api/anime/:animeid/updateReviews/:reviewid`  
  Update a review for a specific anime.

- **DELETE** `/api/anime/:animeid/deleteReview/:reviewid`  
  Delete a review for a specific anime.

### User

- **POST** `/api/user/`  
  Fetch the details of loggedin user
- **POST** `/api/user`  
  Update the logged in user account.

- **DELETE** `/api/user`  
  Delete the logged in user account.

- **PUT** `/api/user`  
  Update the logged in user .

- **PUT** `/api/user/changePassword`  
  Update the logged in user password .

- **GET** `/api/user/myreviews`  
  Fetches all reviews made by the logged in user .

### Admin

- **POST** `/api/anime/`  
  Admin can add a new anime.

- **DELETE** `/api/anime/:animeid`  
  Admin can delete an anime.

- **PUT** `/api/anime/:animeid`  
  Admin can update an anime.

- **GET** `/api/user/allusers?limit =2`  
   Fetch details of all users(not admins) along with searching,sorting,pagination,limit(no.of users).

### 404 Not Found

- **ANY** `/api/*`  
  Handles any non-existent routes. Returns a 404 error with a message: "Route not found."

### Landing Page

- **GET** `/`  
   Serves the "Get Started" HTML page, providing an overview of how to use the OtakuBase API.

## Technologies Used

- **Node.js** - JavaScript runtime for building scalable applications.
- **Express.js** - Web application framework for Node.js.
- **MongoDB** - NoSQL database used for storing data.
- **Mongoose** - MongoDB object modeling for Node.js.
- **JWT (JSON Web Token)** - For user authentication and secure communication.
- **Bcrypt.js** - Library for hashing passwords.
- **Cloudinary** - Cloud storage service for uploading anime posters.
- **Morgan** - HTTP request logger middleware for Node.js.
- **dotenv** - For managing environment variables.
- **Nodemon** - Development tool for automatically restarting the server on code changes.

## Future Enhancements

- Implement user-specific anime recommendations and favourites.

## Author

- **Aindrila Dutta** - [aindrilacodes](https://github.com/aindrilacodes)
