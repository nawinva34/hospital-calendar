package main

import (
	"log"

	"hospital-calendar-backend/database"
	"hospital-calendar-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("Warning: ../.env not found, trying .env")
		if err2 := godotenv.Load(".env"); err2 != nil {
			log.Println("Warning: no .env file found, relying on system environment variables")
		}
	}

	database.ConnectDB()
	database.Migrate()

	app := fiber.New()

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://127.0.0.1:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	routes.RegisterRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
