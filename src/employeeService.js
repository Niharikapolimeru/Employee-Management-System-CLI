
import { readFile, writeFile } from "node:fs/promises";
import { Employee } from "./employee.js";

const FILE_PATH = new URL("../data/employees.json", import.meta.url);

// Read employee records from the JSON file
async function loadEmployees() {
    const content = await readFile(FILE_PATH, "utf8");
    return JSON.parse(content);
}

// Save employee records to the JSON file
async function saveEmployees(employees) {
    await writeFile(
        FILE_PATH,
        JSON.stringify(employees, null, 2),
        "utf8"
    );
}

// Add a new employee
export async function addEmployee(id, name, department, salary) {
    const employees = await loadEmployees();

    const exists = employees.some(employee => employee.id === id);

    if (exists) {
        throw new Error("Employee ID already exists.");
    }

    const employee = new Employee(id, name, department, salary);

    employees.push(employee);
    await saveEmployees(employees);

    return employee;
}

// List all employees
export async function listEmployees() {
    return await loadEmployees();
}

// Search by employee ID or name
export async function searchEmployee(searchTerm) {
    const employees = await loadEmployees();
    const term = searchTerm.trim().toLowerCase();

    return employees.filter(employee =>
        employee.id.toLowerCase() === term ||
        employee.name.toLowerCase().includes(term)
    );
}

// Update employee details
export async function updateEmployee(id, updates) {
    const employees = await loadEmployees();

    const employee = employees.find(employee => employee.id === id);

    if (!employee) {
        throw new Error("Employee not found.");
    }

    employee.name = updates.name;
    employee.department = updates.department;
    employee.salary = updates.salary;

    await saveEmployees(employees);

    return employee;
}

// Delete an employee
export async function deleteEmployee(id) {
    const employees = await loadEmployees();

    const index = employees.findIndex(employee => employee.id === id);

    if (index === -1) {
        throw new Error("Employee not found.");
    }

    const deletedEmployee = employees.splice(index, 1)[0];

    await saveEmployees(employees);

    return deletedEmployee;
}
