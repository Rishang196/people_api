const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Human API",
      version: "1.0.0",
      description:
        "Human API - AI-powered platform for discovering and matching people based on skills, expertise, education, experience and location."
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration and login"
      },
      {
        name: "Users",
        description: "Search and retrieve users"
      },
      {
        name: "Profile",
        description: "Manage authenticated user profile"
      },
      {
        name: "AI Matching",
        description: "AI-powered human matching"
      },
      {
        name: "System",
        description: "Health and API information"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },

      schemas: {
        RegisterRequest: {
          type: "object",
          required: [
            "name",
            "email",
            "password"
          ],
          properties: {
            name: {
              type: "string",
              example: "Aman"
            },
            email: {
              type: "string",
              format: "email",
              example: "aman@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "Aman12345"
            }
          }
        },

        LoginRequest: {
          type: "object",
          required: [
            "email",
            "password"
          ],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "aman@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "Aman12345"
            }
          }
        },

        SocialLinks: {
          type: "object",
          properties: {
            linkedin: {
              type: "string",
              example: "https://linkedin.com/in/example"
            },
            github: {
              type: "string",
              example: "https://github.com/example"
            },
            twitter: {
              type: "string",
              example: "https://twitter.com/example"
            }
          }
        },

        ProfileUpdate: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Aman"
            },
            skills: {
              type: "array",
              items: {
                type: "string"
              },
              example: [
                "JavaScript",
                "Node.js",
                "MongoDB"
              ]
            },
            expertise: {
              type: "array",
              items: {
                type: "string"
              },
              example: [
                "Backend Development"
              ]
            },
            education: {
              type: "string",
              example: "B.Tech CSE"
            },
            experience: {
              type: "string",
              example: "2 years"
            },
            location: {
              type: "string",
              example: "Varanasi"
            },
            portfolio: {
              type: "string",
              example: "https://example.com"
            },
            socialLinks: {
              $ref: "#/components/schemas/SocialLinks"
            }
          }
        }
      }
    }
  },

  apis: [
    "./src/swagger.js"
  ]
};


// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Check backend health
 *     responses:
 *       200:
 *         description: Backend is healthy
 */

/**
 * @swagger
 * /api:
 *   get:
 *     tags:
 *       - System
 *     summary: Get API information
 *     responses:
 *       200:
 *         description: API information
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProfileUpdate"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Search and list users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: skill
 *         in: query
 *         schema:
 *           type: string
 *         example: JavaScript
 *
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *         example: Varanasi
 *
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a single user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/matching/ai-test:
 *   get:
 *     tags:
 *       - AI Matching
 *     summary: Test Gemini AI connection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI connection successful
 *       500:
 *         description: AI connection failed
 */

/**
 * @swagger
 * /api/matching/search:
 *   get:
 *     tags:
 *       - AI Matching
 *     summary: Find AI-powered human matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: skill
 *         in: query
 *         schema:
 *           type: string
 *         example: JavaScript backend developer
 *
 *     responses:
 *       200:
 *         description: AI-generated matching results
 *       401:
 *         description: Authentication required
 *       500:
 *         description: AI matching failed
 */


const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;