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
   cd otakuBase

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