var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "P@$$word",
  database: "workplace_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Department",
        "View Role",
        "View Employee",
        "Update Employee Role"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add Department":
        addDepartment();
        break;

      case "View Department":
        departmentView();
        break;

      case "Add Role":
        addRole();
        break;

      case "View Role":
        viewRole();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "View Employee":
        viewEmployee();
        break;

      case "Update Employee Role":
        updateEmployee();
        break;
      }
    });
}
function viewRole() {
    connection.query("SELECT * FROM role", function(err, results){
        console.table(results);
        runSearch();
    })
}
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is your department name?"
    })
    .then(function(answer) {
      var query = "INSERT INTO department(name) values(?)" ;
      connection.query(query, answer.department, function(err, res) {
        if (err) throw err;
       console.log("Department added.");
        runSearch();
      });
    });
}

function departmentView() {
  var query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res)
    runSearch();
  });
}

function addRole() {
    connection.query("SELECT concat(id,' - ', name) name FROM department", function(err, results){
         const departments = results.map(department => department);

        inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is your role?"
          },
          {
            name: "salary",
            type: "input",
            validate: function(input){
                  if (isNaN(input)){
                      return false
                  } else {
                      return true
                  }
            },
            message: "What is the salary for this role?"
          }, {
             type: "list",
            name: "department_id",
            message: "Please choose a department.",
            choices: departments
          }
        ])
        .then(function(answer) {
            const department_id = answer.department_id.split(" - ")
            const id = department_id[0];
            
          var query = "INSERT INTO role(title, salary, department_id)values(?, ?, ?)";
          connection.query(query, [answer.title, answer.salary, id], function(err, res) {
            if (err) throw err;
            console.log("Role added!");
            runSearch();
          });
        });
    }) 
}

function viewEmployee() {
  var query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res)
    runSearch();
  });
}
function addEmployee() {
  connection.query("SELECT title FROM workplace_db.role", function(err, results){
    const roles = results.map(role=> role.title);
    
      inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?"
        },
        {
          name: "title",
          type: "list",
          message: "What is the employee's role?",
          choices: roles
        },
        
          
      ])
      .then(function(answer) {
        const role_id = answer.title.split("-")
        const id = role_id[0];

        const manager = answer.title.split("-").join(",");
        const id_manager = manager[0];

        let query = "INSERT INTO workplace_db.employee(first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)";
        connection.query(query, [answer.first_name, answer.last_name, id, id_manager], function(err, res) {
          if (err) throw err;
          runSearch();
        });
      });
  }); 
};

function updateEmployee() {
  connection.query("SELECT first_name FROM workplace_db.employee", function(err, results){
    const employees = results.map(employee => employee.first_name)
    
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
      .then(function(answer) {
        const newEmployeeRole = answer.first_name

        let query = "INSERT INTO workplace_db.employee(first_name) values(?)";
        connection.query(query, [newEmployeeRole], function(err, res) {
          if (err) throw err;
        })

  connection.query("SELECT title FROM workplace_db.role", function(err, results){
    const roles = results.map(role => role.title);

    inquirer
      .prompt([
        {
          name: "role_id",
          type: "list",
          message: "What is the updated role for your employee?",
          choices: roles
        }
      ])
      .then(function(answer) {
        const role_id = answer.role_id
        const id = role_id[0];

        let query = "INSERT INTO workplace_db.employee(role_id) values(?)";
        connection.query(query, [id], function(err, res) {
          if (err) throw err;
          runSearch();
        });
      });
    }); 
  }); 
})};
      

