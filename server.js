const mysql = require("mysql")
const inquirer = require("inquirer")
require("dotenv").config()

// connects mysql db to the server.js
let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "employees_db",
})

connection.connect(function (err) {
  if (err) throw err
  console.log("connected as id " + connection.thread_id)
  start()
})

// starts program
function start() {
  console.log("*******************************")
  inquirer
    .prompt({
      type: "list",
      name: "select",
      message: "Select what you would like to do.",
      choices: [
        "Add Departments",
        "Add Roles",
        "Add Employees",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.select) {
        case "Add Departments":
          addDepartments()
          break
        case "Add Roles":
          addRoles()
          break
        case "Add Employees":
          addEmployees()
          break
        case "View Departments":
          viewDepartments()
          break
        case "View Roles":
          viewRoles()
          break
        case "View Employees":
          viewEmployees()
          break
        case "Update Employee Role":
          updateEmployeeRoles()
          break
        default:
          connection.end()
      }
    })
}

function addDepartments() {
  console.log("*******************************")
  inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "Enter your department.",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.department },
        function (err) {
          if (err) throw err
          start()
        }
      )
    })
}

function addRoles() {
  console.log("*******************************")
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err
    let emp_department = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      }
    })
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter your role title.",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter salary for role.",
        },
        {
          type: "list",
          name: "department_id",
          message: "Choose the department id for role.",
          choices: emp_department,
        },
      ])
      .then(function (response) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: response.title,
            salary: response.salary,
            department_id: response.department_id,
          },
          function (err) {
            if (err) throw err
            start()
          }
        )
      })
  })
}

function addEmployees() {
  console.log("*******************************")
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err
    let emp_role = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
      }
    })
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err
      let employee = res.map((emp) => {
        return {
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        }
      })
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter employees first name.",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter employees last name.",
          },
          {
            type: "list",
            name: "role_id",
            message: "Choose employees role.",
            choices: emp_role,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Select employees manager.",
            choices: employee,
            when: function (answers) {
              return employee.length > 0
            },
          },
        ])
        .then(function (answer) {
          if (!answer.manager_id) {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
              },
              function (err) {
                if (err) throw err
                start()
              }
            )
          } else {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
              },
              function (err) {
                if (err) throw err
                start()
              }
            )
          }
        })
    })
  })
}

function viewDepartments() {
  console.log("*******************************")
  let view_department = "SELECT * FROM department"
  connection.query(view_department, function (err, data) {
    if (err) throw err
    console.table(data)
    start()
  })
}

function viewRoles() {
  console.log("*******************************")
  let view_role = "SELECT * FROM role"
  connection.query(view_role, function (err, data) {
    if (err) throw err
    console.table(data)
    start()
  })
}

function viewEmployees() {
  console.log("*******************************")
  let view_employee = "SELECT * FROM employee"
  connection.query(view_employee, function (err, data) {
    if (err) throw err
    console.table(data)
    start()
  })
}

function updateEmployeeRoles() {
  console.log("*******************************")
  let update_emp_roles = "SELECT * FROM role"
  connection.query(update_emp_roles, function (err, data) {
    if (err) throw err
    let update_role = data.map((role) => {
      return {
        name: `${role.title} ${role.salary} ${role.department_id}`,
        value: role.id,
      }
    })
    let update_department = "SELECT * FROM department"
    connection.query(
      update_department,
      function (department_err, department_data) {
        if (department_err) throw department_err
        let updated_department = data.map((role) => {
          console.log(role)
          return {
            name: `${role.title}`,
            value: role.id,
          }
        })
        inquirer
          .prompt([
            {
              type: "list",
              name: "update_emp_roles",
              choices: update_role,
              message: "Which role do you want to update?",
            },
            {
              type: "input",
              name: "updated_title",
              message: "Enter new job title.",
            },
            {
              type: "input",
              name: "updated_salary",
              message: "Enter new job salary.",
            },
            {
              type: "list",
              name: "updated_department",
              message: "Choose new department.",
              choices: updated_department,
            },
          ])
          .then(function (response) {
            let item_id
            for (let i = 0; i < department_data.length; i++) {
              console.log(department_data[i].id)
              if (department_data[i].id === response.update_emp_roles) {
                item_id = department_data[i].id
              }
            }
            connection.query(
              "UPDATE role SET ? WHERE ?",
              [
                {
                  title: response.updated_title,
                  salary: response.updated_salary,
                  department_id: response.updated_department,
                },
                {
                  id: item_id,
                },
              ],
              function (err, data) {
                if (err) throw err
                console.log(data)
                start()
              }
            )
          })
      }
    )
  })
}
