package handlers

import (
	"hospital-calendar-backend/database"
	"hospital-calendar-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetEmployees(c *fiber.Ctx) error {
	var employees []models.Employee
	database.DB.Order("id asc").Find(&employees)

	if len(employees) == 0 {
		seedEmployees := []models.Employee{
			{Name: "Dr. Sarah Johnson", Position: "แพทย์", Department: "ER", Email: "sarah.j@hospital.com"},
			{Name: "Nurse Michael Chen", Position: "พยาบาล", Department: "ICU", Email: "michael.c@hospital.com"},
			{Name: "Dr. Emily Rodriguez", Position: "แพทย์", Department: "Surgery", Email: "emily.r@hospital.com"},
			{Name: "Nurse David Kim", Position: "พยาบาล", Department: "Pediatrics", Email: "david.k@hospital.com"},
			{Name: "Dr. James Wilson", Position: "แพทย์", Department: "Cardiology", Email: "james.w@hospital.com"},
		}

		database.DB.Create(&seedEmployees)
		database.DB.Order("id asc").Find(&employees)
	}

	return c.JSON(fiber.Map{"success": true, "data": employees})
}

func GetEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	result := database.DB.First(&employee, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Employee not found"})
	}

	return c.JSON(fiber.Map{"success": true, "data": employee})
}

func CreateEmployee(c *fiber.Ctx) error {
	employee := new(models.Employee)
	if err := c.BodyParser(employee); err != nil {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
	}

	database.DB.Create(&employee)
	return c.Status(201).JSON(fiber.Map{"success": true, "data": employee, "message": "Employee created successfully"})
}

func UpdateEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	if err := database.DB.First(&employee, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Employee not found"})
	}

	updateData := new(models.Employee)
	if err := c.BodyParser(updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
	}

	employee.Name = updateData.Name
	employee.Position = updateData.Position
	employee.Department = updateData.Department
	employee.Email = updateData.Email

	database.DB.Save(&employee)
	return c.JSON(fiber.Map{"success": true, "data": employee, "message": "Employee updated successfully"})
}

func DeleteEmployee(c *fiber.Ctx) error {
	id := c.Params("id")
	var employee models.Employee

	if err := database.DB.First(&employee, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Employee not found"})
	}

	database.DB.Where("employee_id = ?", id).Delete(&models.Shift{})
	database.DB.Delete(&employee)
	return c.JSON(fiber.Map{"success": true, "message": "Employee deleted successfully"})
}
