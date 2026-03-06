package database

import "hospital-calendar-backend/models"

func Migrate() {
	DB.AutoMigrate(&models.Employee{}, &models.Shift{})
}
