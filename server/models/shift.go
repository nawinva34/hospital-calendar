package models

type Shift struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	EmployeeID   uint      `json:"employeeId"`
	Employee     *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	EmployeeName string    `json:"employeeName"`
	ShiftTime    string    `json:"shiftTime"`
	Date         string    `json:"date"`
	Status       string    `gorm:"default:'scheduled'" json:"status"`
}
