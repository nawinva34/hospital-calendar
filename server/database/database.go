package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Use GO_DATABASE_URL for a direct postgres:// connection string.
	// The main DATABASE_URL is a Prisma Accelerate proxy URL that GORM cannot use.
	dsn := os.Getenv("GO_DATABASE_URL")
	if dsn == "" {
		log.Fatal("GO_DATABASE_URL environment variable is not set. Please add it to .env")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	log.Println("Database connected")
	DB = db
}
