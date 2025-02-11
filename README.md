# Advanced URL Shortener App

## Project Overview

A custom URL Shortener API that includes advanced analytics, user authentication via Google Sign-In, and rate limiting. This system allows users to create short URLs, simplifying the sharing of long, complex URLs across various platforms and making link distribution more concise and manageable.

It offers unique features such as grouping links under specific topics (e.g., acquisition, activation, retention) and providing detailed analytics for both individual and overall URL performance.

## 🚀 Features

- Google OAuth for user authentication
- Custom alias for short URLs
- Short URL analytics
- Caching using Redis
- Rate limiting
- Containerized application
- CI integration
- Google Kubernetes Engine (GKE) deployment

## 🛠 Tech Stack

Node.js, Express, TypeScript, MongoDB, Redis, Swagger

## 🔗 Links and Instructions

### Step 1: Authentication

1. Open [https://jamsheer.life/api/v1/auth/google/url](https://jamsheer.life/api/v1/auth/google/url) in your browser.
2. Select your email.  
   ![Demo](docs/demo_select_email.png)
3. Copy the token from the response after completing authentication.  
   ![Demo](docs/copy_token.png)
4. Open [https://jamsheer.life/api/v1/docs/](https://jamsheer.life/api/v1/docs/) you will see Swagger API documentation.
5. Press the "Authorize" button and paste the token.  
   ![Demo](docs/paste_token.png)  
   Now you can use all APIs except auth APIs.  
   **Note:** When using the "redirect to long URL" feature, Swagger will not directly open the URL. Instead, copy the URL from the request and open it in a new browser tab.  
   ![Demo](docs/redirect_url.png)

## 🚀 Quick Start for Local Installation

1. Clone the project

   ```bash
   git clone https://github.com/jamsheerply/Advanced-URL-Shortener-app.git
   ```

2. Go to the project directory

   ```bash
   cd "Advanced URL Shortener app"
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Configure environment variables by creating a `.env` file:

   ```plaintext
   # MongoDB configuration
   MONGODB_URL=<your-mongodb-string>

   # Redis configuration
   REDIS_PASSWORD=<your-redis-password>

   # Google OAuth configuration
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

   # JWT configuration
   JWT_ACCESS_TOKEN_SECRET=<access-token-secret>
   JWT_REFRESH_TOKEN_SECRET=<refresh-token-secret>

   # Rate limiter configuration
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=60000

   # Server configuration
   PORT=3000
   NODE_ENV=development

   # Domain name configuration
   DOMAIN_NAME=http://localhost:3000
   ```

   > Make sure to replace placeholder values with your actual configuration.

5. Start the server

   ```bash
   npm run build
   npm run start
   ```

## Testing Instructions

### Step 1: Authentication

1. Open [http://localhost:3000/api/v1/auth/google/url](http://localhost:3000/api/v1/auth/google/url) in your browser.
2. Select your email.  
   ![Demo](docs/demo_select_email.png)
3. Copy the token from the response after completing authentication.  
   ![Demo](docs/copy_token.png)
4. Open [http://localhost:3000/api/v1/docs/](http://localhost:3000/api/v1/docs/) you will see Swagger API documentation.
5. Press the "Authorize" button and paste the token.  
   ![Demo](docs/paste_token.png)  
   **Note:** When using the "redirect to long URL" feature, Swagger will not directly open the URL. Instead, copy the URL from the request and open it in a new browser tab.  
   ![Demo](docs/redirect_url.png)

## API Documentation

Access detailed API documentation [here](https://jamsheer.life/api/v1/docs/), including all available endpoints, request/response formats, and example usage.

## Database Design

The database design for this application is documented [here](docs/data_base_design.png). It includes diagrams and descriptions of the database schema and relationships between collections.

## Application Workflow Diagram

The following diagram shows how the application processes requests from routing to the database and cache layers:  
![Application Workflow](docs/Application_workFlow.png)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact & Support

For questions, support, or collaboration:

- **Email**: jamsheerpayyoli@gmail.com
- **Phone**: +91 9020432432
- **GitHub Issues**: For bug reports and feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Jamsheer](https://github.com/jamsheerply)
