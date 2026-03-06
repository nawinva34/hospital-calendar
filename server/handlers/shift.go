package handlers

import (
	"hospital-calendar-backend/database"
	"hospital-calendar-backend/models"

	"github.com/gofiber/fiber/v2"
)

var validShiftTimes = map[string]bool{
	"08-16": true,
	"08-20": true,
	"08-24": true,
	"16-24": true,
	"24-08": true,
}

func GetShifts(c *fiber.Ctx) error {
	var shifts []models.Shift

	query := database.DB.Model(&models.Shift{})

	if employeeId := c.Query("employeeId"); employeeId != "" {
		query = query.Where("employee_id = ?", employeeId)
	}
	if date := c.Query("date"); date != "" {
		query = query.Where("date = ?", date)
	}

	query.Order("date asc").Find(&shifts)

	return c.JSON(fiber.Map{"success": true, "data": shifts})
}

func GetShift(c *fiber.Ctx) error {
	id := c.Params("id")
	var shift models.Shift

	if err := database.DB.First(&shift, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Shift not found"})
	}

	return c.JSON(fiber.Map{"success": true, "data": shift})
}

func CreateShift(c *fiber.Ctx) error {
	shift := new(models.Shift)
	if err := c.BodyParser(shift); err != nil {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
	}

	if !validShiftTimes[shift.ShiftTime] {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": "Invalid shift time"})
	}

	if shift.Status == "" {
		shift.Status = "confirmed"
	}

	database.DB.Create(&shift)
	return c.Status(201).JSON(fiber.Map{"success": true, "data": shift, "message": "Shift created successfully"})
}

func UpdateShift(c *fiber.Ctx) error {
	id := c.Params("id")
	var shift models.Shift

	if err := database.DB.First(&shift, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Shift not found"})
	}

	updateData := new(models.Shift)
	if err := c.BodyParser(updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
	}

	if updateData.ShiftTime != "" && !validShiftTimes[updateData.ShiftTime] {
		return c.Status(400).JSON(fiber.Map{"success": false, "error": "Invalid shift time"})
	}

	shift.EmployeeID = updateData.EmployeeID
	shift.EmployeeName = updateData.EmployeeName
	shift.ShiftTime = updateData.ShiftTime
	shift.Date = updateData.Date
	shift.Status = updateData.Status

	database.DB.Save(&shift)
	return c.JSON(fiber.Map{"success": true, "data": shift, "message": "Shift updated successfully"})
}

func DeleteShift(c *fiber.Ctx) error {
	id := c.Params("id")
	var shift models.Shift

	if err := database.DB.First(&shift, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "Shift not found"})
	}

	database.DB.Delete(&shift)
	return c.JSON(fiber.Map{"success": true, "data": shift, "message": "Shift deleted successfully"})
}
