# Advanced-URL-Shortener-app

src/
├── config/
│ └── index.ts
│ └── swagger.ts
├── controllers/
│ └── url.controller.ts
│ └── auth.controller.ts
│ └── analytics.controller.ts
├── middlewares/
│ └── auth.middleware.ts
│ └── errorHandler.middleware.ts
│ └── rateLimiter.middleware.ts
├── models/
│ └── url.model.ts
│ └── user.model.ts
│ └── analytics.model.ts
├── routes/
│ └── url.routers.ts
│ └── auth.routers.ts
│ └── analytics.routers.ts
├── services/
│ └── url.service.ts
│ └── auth.service.ts
│ └── analytics.service.ts
│ └── redis.service.ts
├── types/
│ └── custom.d.ts
│ └── index.ts
├── utils/
│ └── appError.ts
│ └── asyncHandler.ts
├── validations/
│ └── urlValidation.ts
│ └── validateRequest.ts
├── tests/
│ └── url.controller.test.ts
│ └── auth.controller.test.ts
│ └── analytics.controller.test.ts
│ └── errorHandler.middleware.test.ts
│ └── rateLimiter.middleware.test.ts
├──app.ts
