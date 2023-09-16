const db = require("./db/connection.js");
const { prompt } = require("inquirer");

const util = require("util");

db.query = util.promisify(db.query);

function startApp() {

    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit",
            ],
        },
    ])
        .then((options) => {
            switch (options.choice) {
                case "View all departments":
                    viewDepts();
                    break;

                case "View all roles":
                    viewRoles();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "Add a department":
                    addDepartment();
                    break;

                case "Add a role":
                    addRole();
                    break;

                case "Add an employee":
                    addEmployee();
                    break;

                case "Update an employee role":
                    updateEmployee();
                    break;

                case "Quit":
                    db.close();
            }
        });
}

startApp();

async function viewDepts() {
    const depts = await db.query("SELECT * FROM department");
    console.table(depts);
    startApp();
}

async function viewRoles() {
    const roles = await db.query("SELECT department.name AS 'Department Name', role.Title, role.Salary FROM department JOIN role ON department.id = role.department_id ");
    console.table(roles);
    startApp();
}

async function viewEmployees() {
    const employee = await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
                    AS "last name", role.title, department.name AS department, role.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id`)
    console.table(employee);
    startApp();
}

async function addDepartment() {
    const department = await prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the department:",
        },
    ]);

    await db.query("INSERT INTO department (name) VALUES (?)", department.name);
    console.log("Department added successfully!");
    startApp();
}

async function addRole() {
    const departments = await db.query("SELECT * FROM department");
    const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const role = await prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the role:",
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary for this role:",
        },
        {
            type: "list",
            name: "department_id",
            message: "Select the department for this role:",
            choices: departmentChoices,
        },
    ]);

    await db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [
        role.title,
        role.salary,
        role.department_id,
    ]);
    console.log("Role added successfully!");
    startApp();
}

async function addEmployee() {
    const roles = await db.query("SELECT * FROM role");
    const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const employees = await db.query("SELECT * FROM employee");
    const managerChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    managerChoices.push({ name: "None", value: null });

    const employee = await prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter the employee's first name:",
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter the employee's last name:",
        },
        {
            type: "list",
            name: "role_id",
            message: "Select the employee's role:",
            choices: roleChoices,
        },
        {
            type: "list",
            name: "manager_id",
            message: "Select the employee's manager:",
            choices: managerChoices,
        },
    ]);

    await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]
    );
    console.log("Employee added successfully!");
    startApp();
}

async function updateEmployee() {
    const employees = await db.query("SELECT * FROM employee");
    const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const roles = await db.query("SELECT * FROM role");
    const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const updateInfo = await prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Select the employee to update:",
            choices: employeeChoices,
        },
        {
            type: "list",
            name: "role_id",
            message: "Select the employee's new role:",
            choices: roleChoices,
        },
    ]);

    await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
        updateInfo.role_id,
        updateInfo.employee_id,
    ]);
    console.log("Employee role updated successfully!");
    startApp();
};

