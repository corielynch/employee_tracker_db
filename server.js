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

    //     case "Remove Employee":
    //     removeEmployee();
    //     break;

    //     case "Update Employee Role":
    //     updateRole();
    //     break;

    //     case "Update Employee Manager":
    //     updateManager();
    //     break;

    //     case "exit":
    //     connection.end();
    //     break;
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

function employeeAdd() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
        if (err) throw err;
        console.log(
          "Position: " +
            res[0].position +
            " || Song: " +
            res[0].song +
            " || Artist: " +
            res[0].artist +
            " || Year: " +
            res[0].year
        );
        runSearch();
      });
    });
}

function removeEmployee() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
          if (err) throw err;
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        });
      });
  }

  function updateRole() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
          if (err) throw err;
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        });
      });
  }

  function updateManager() {
    inquirer
      .prompt({
        name: "song",
        type: "input",
        message: "What song would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
          if (err) throw err;
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          runSearch();
        });
      });
  }
