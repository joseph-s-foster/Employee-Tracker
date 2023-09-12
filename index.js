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
};