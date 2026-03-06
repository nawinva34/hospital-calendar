package routes

import (
	"hospital-calendar-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")

	employees := api.Group("/employees")
	employees.Get("/", handlers.GetEmployees)
	employees.Get("/:id", handlers.GetEmployee)
	employees.Post("/", handlers.CreateEmployee)
	employees.Put("/:id", handlers.UpdateEmployee)
	employees.Delete("/:id", handlers.DeleteEmployee)

	shifts := api.Group("/shifts")
	shifts.Get("/", handlers.GetShifts)
	shifts.Get("/:id", handlers.GetShift)
	shifts.Post("/", handlers.CreateShift)
	shifts.Put("/:id", handlers.UpdateShift)
	shifts.Delete("/:id", handlers.DeleteShift)
}
