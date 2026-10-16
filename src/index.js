
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import {
    addEmployee,
    listEmployees,
    searchEmployee,
    updateEmployee,
    deleteEmployee
} from "./employeeService.js";

const rl = createInterface({
    input: stdin,
    output: stdout
});

async function ask(question) {
    return (await rl.question(question)).trim();
}

async function askRequired(question) {
    while (true) {
        const value = await ask(question);

        if (value !== "") {
            return value;
        }

        console.log("This field is required.");
    }
}

async function askSalary(question, currentSalary) {
    while (true) {
        const answer = await ask(question);

        if (answer === "" && currentSalary !== undefined) {
            return currentSalary;
        }

        const salary = Number(answer);

        if (answer !== "" && Number.isFinite(salary) && salary > 0) {
            return salary;
        }

        console.log("Enter a valid salary greater than 0.");
    }
}

function displayEmployees(employees) {
    if (employees.length === 0) {
        console.log("\nNo employees found.");
        return;
    }

    console.table(employees);
}

// 1. Add employee
async function addEmployeeMenu() {
    console.log("\n--- Add Employee ---");

    const id = await askRequired("Enter employee ID: ");
    const name = await askRequired("Enter employee name: ");
    const department = await askRequired("Enter department: ");
    const salary = await askSalary("Enter salary: ");

    await addEmployee(id, name, department, salary);

    console.log("Employee added successfully!");
}

// 2. List employees
async function listEmployeesMenu() {
    console.log("\n--- Employee List ---");

    const employees = await listEmployees();
    displayEmployees(employees);
}

// 3. Search employee
async function searchEmployeeMenu() {
    console.log("\n--- Search Employee ---");

    const term = await askRequired("Enter employee ID or name: ");
    const employees = await searchEmployee(term);

    displayEmployees(employees);
}

// 4. Update employee
async function updateEmployeeMenu() {
    console.log("\n--- Update Employee ---");

    const id = await askRequired("Enter employee ID to update: ");
    const employees = await listEmployees();
    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
        console.log("Employee not found.");
        return;
    }

    console.log("Press Enter to keep an existing value.");

    const nameInput = await ask(`Name (${employee.name}): `);
    const departmentInput = await ask(
        `Department (${employee.department}): `
    );

    const name = nameInput || employee.name;
    const department = departmentInput || employee.department;
    const salary = await askSalary(
        `Salary (${employee.salary}): `,
        employee.salary
    );

    await updateEmployee(id, { name, department, salary });

    console.log("Employee updated successfully!");
}

// 5. Delete employee
async function deleteEmployeeMenu() {
    console.log("\n--- Delete Employee ---");

    const id = await askRequired("Enter employee ID to delete: ");
    const employees = await listEmployees();
    const employee = employees.find(emp => emp.id === id);

    if (!employee) {
        console.log("Employee not found.");
        return;
    }

    const confirmation = await ask(
        `Delete ${employee.name}? Type yes to confirm: `
    );

    if (confirmation.toLowerCase() !== "yes") {
        console.log("Deletion cancelled.");
        return;
    }

    await deleteEmployee(id);

    console.log("Employee deleted successfully!");
}

// Main menu
async function main() {
    let running = true;

    console.log("\n=== EMPLOYEE MANAGEMENT SYSTEM ===");

    try {
        while (running) {
            console.log("\n1. Add Employee");
            console.log("2. List Employees");
            console.log("3. Search Employee");
            console.log("4. Update Employee");
            console.log("5. Delete Employee");
            console.log("6. Exit");

            const choice = await ask("\nChoose an option (1-6): ");

            try {
                switch (choice) {
                    case "1":
                        await addEmployeeMenu();
                        break;

                    case "2":
                        await listEmployeesMenu();
                        break;

                    case "3":
                        await searchEmployeeMenu();
                        break;

                    case "4":
                        await updateEmployeeMenu();
                        break;

                    case "5":
                        await deleteEmployeeMenu();
                        break;

                    case "6":
                        running = false;
                        console.log("Thank you for using the application!");
                        break;

                    default:
                        console.log("Invalid choice. Enter 1 to 6.");
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    } finally {
        rl.close();
    }
}

main().catch(error => {
    console.error("Application error:", error.message);
    rl.close();
});
