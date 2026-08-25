const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Human API",
    version: "1.0.0",
    description: "AI-powered Human Matching API"
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,

  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;