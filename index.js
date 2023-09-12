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