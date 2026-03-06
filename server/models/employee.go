package models

type Employee struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	Name       string  `json:"name"`
	Position   string  `json:"position"`
	Department string  `json:"department"`
	Email      string  `json:"email"`
	Shifts     []Shift `gorm:"foreignKey:EmployeeID" json:"shifts,omitempty"`
}
