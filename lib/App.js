const inquirer = require("inquirer");
const fetch = require("node fetch");
const cTable = require("console.table");

function initializeApp() {
  // displays menu for user to select
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "View Total Utilized Budget By Department",
          "Add An Employee",
          "Remove An Employee",
          "Update An Employee's Role",
          "Update An Employee's Manager",
          "View All Departments",
          "Add A Department",
          "Delete A Department",
          "View All Roles",
          "Add A Role",
          "Delete A Role",
          "Exit",
        ],
      },
    ])
    .then((selection) => {
      switch (selection.menu) {
        // if user selects 'view all employees'
        case "View All Employees":
          fetch("http://localhost:3001/api/employees")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            // return to menu
            .then(initializeApp);
          break;
        // if user selects 'view employees by department'
        case "View All Employees By Department":
          fetch("http://localhost:3001/api/employees-dept")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            // return to menu
            .then(initializeApp);
          break;
        // if user select view all employees by manager
        case "View All Employees By Manager":
          fetch("http://localhost:3001/api/managersgroup")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            //return to menu
            .then(initializeApp);
          break;
        //if user selects view budget
        case "View Total Utilized Budget By Department":
          fetch("http://localhost:3001/api/payroll")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            // return to menu
            .then(initializeApp);
          break;
        //if user selects view all departments
        case "View All Departments":
          fetch("http://localhost:3001/api/departments")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            // return to menu
            .then(initializeApp);
          break;
        //if user selects view all roles
        case "View All Roles":
          fetch("http://localhost:3001/api/roles")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              console.table(employeeData.data);
            })
            //return to menu
            .then(initializeApp);
          break;
        // if user selects add an employee
        case "Add An Employee":
          const rolesArray = [];
          const managersArray = [];
          // get name of all the roles and push to rolesarray
          fetch("http://localhost:3001/api/roles")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              for (let i = 0; i < employeeData.data.length; i++) {
                rolesArray.push(employeeData.data[i].title);
              }
              // get name of all managers and push to managers array
              fetch("http://localhost:3001/api/managersgroup")
                .then((response) => {
                  if (!response.ok) {
                    return console.log("Error: " + response.statusText);
                  }
                  return response.json();
                })
                .then((employeeData) => {
                  for (let i = 0; i < employeeData.data.length; i++) {
                    managersArray.push(employeeData.data[i].manager);
                  }

                  const employeeInfo = [rolesArray, managersArray];

                  return employeeInfo;
                })
                .then((employeeInfo) => {
                  // get information from user to create new employee
                  const questions = [
                    {
                      type: "input",
                      name: "first_name",
                      message: "What is your employee's first name? (Required)",
                      validate: (firstNameInput) => {
                        if (firstNameInput) {
                          return true;
                        } else {
                          console.log(
                            "Please enter your employee's first name!"
                          );
                          return false;
                        }
                      },
                    },
                    {
                      type: "input",
                      name: "last_name",
                      message: "What is your employee's last name? (Required)",
                      validate: (lastNameInput) => {
                        if (lastNameInput) {
                          return true;
                        } else {
                          console.log(
                            "Please enter your employee's last name!"
                          );
                          return false;
                        }
                      },
                    },
                    {
                      type: "list",
                      name: "role_id",
                      message: "Please select a role for the employee",
                      //pull the roles array from above
                      choices: employeeInfo[0],
                    },
                    {
                      type: "list",
                      name: "manager_id",
                      message: "Please select a manager for the employee",
                      // pull the managers array from above
                      choices: [
                        ...new Set(employeeInfo[1].filter((item) => !!item)),
                      ],
                    },
                  ];

                  return inquirer.prompt(questions);
                })
                .then(async (employeeObject) => {
                  const response = await fetch(
                    "http://localhost:3001/api/role/" + employeeObject.role_id
                  );

                  if (!response.ok) {
                    return console.log("Error: " + response.statusText);
                  } else {
                    const data = await response.json();

                    const roleId = data.data[0].id;

                    employeeObject.role_id = roleId;
                  }

                  const managerFirstName =
                    employeeObject.manager_id.split(" ")[0];
                  const managerLastName =
                    employeeObject.manager_id.split(" ")[1];
                  // get employee id for manager of employee and add it to employee object
                  const response2 = await fetch(
                    "http://localhost:3001/api/employee/" +
                      managerFirstName +
                      "/" +
                      managerLastName
                  );

                  if (!response2.ok) {
                    return console.log("Error: " + response2.statusText);
                  } else {
                    const data2 = await response2.json();

                    const managerId = data2.data[0].id;

                    employeeObject.manager_id = managerId;
                  }

                  return employeeObject;
                })
                // create new employee
                .then((employeeObject) => {
                  fetch("http://localhost:3001/api/employee", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(employeeObject),
                  })
                    .then((response) => {
                      if (response.ok) {
                        return response.json();
                      }
                      alert("Error: " + response.statusText);
                    })
                    .then((postResponse) => {
                      console.log(postResponse);
                      console.log("Employee has been added to the database");
                    });
                })
                // return to menu
                .then(initializeApp);
            });

          break;
        // user selects to delete an employee
        case "Remove An Employee":
          // get a list of employees Names from db
          fetch("http://localhost:3001/api/employees")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              const employeeNames = [];

              employeeData.data.forEach((employee) => {
                employeeNames.push(
                  employee.first_name + " " + employee.last_name
                );
              });

              return employeeNames;
            })
            .then((employeeNames) => {
              return inquirer.prompt([
                {
                  type: "list",
                  name: "employeeName",
                  message:
                    "Please select which employee you would like to remove.",
                  choices: employeeNames,
                },
              ]);
            })
            .then(async (selection) => {
              // get id of employee
              const employeeFirstName = selection.employeeName.split(" ")[0];
              const employeeLastName = selection.employeeName.split(" ")[1];

              const response = await fetch(
                "http://localhost:3001/api/employee/" +
                  employeeFirstName +
                  "/" +
                  employeeLastName
              );

              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                const data = await response.json();
                //pull employee ID to pass to delete route
                return data.data[0].id;
              }
            })
            //delete employee that user selected
            .then((employeeId) => {
              fetch(`http://localhost:3001/api/employee/${employeeId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            })
            // return to menu
            .then(initializeApp);
          break;
        // if user selects to update an employee's role
        case "Update An Employee's Role":
          //present the list of employee names to the User to select

          // take the user's selection, split it and assign the value to first name and last name
          // use that info to get the id of the selected employee with fetch
          fetch("http://localhost:3001/api/employees")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              const employeeNames = [];

              employeeData.data.forEach((employee) => {
                employeeNames.push(
                  employee.first_name + " " + employee.last_name
                );
              });

              return employeeNames;
            })
            .then((employeeNames) => {
              return inquirer.prompt([
                {
                  type: "list",
                  name: "employeeName",
                  message:
                    "Please select which employee you would like to update the role for.",
                  choices: employeeNames,
                },
              ]);
            })
            .then(async (selection) => {
              const employeeFirstName = selection.employeeName.split(" ")[0];
              const employeeLastName = selection.employeeName.split(" ")[1];

              const response = await fetch(
                "http://localhost:3001/api/employee/" +
                  employeeFirstName +
                  "/" +
                  employeeLastName
              );

              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                const data = await response.json();
                //pull employee ID to pass to delete route
                return data.data[0].id;
              }
            })
            .then(async (employeeId) => {
              const updatedEmployee = {};

              updatedEmployee.id = employeeId;

              return updatedEmployee;
            })
            .then(async (updatedEmployeeObject) => {
              const rolesArray = [];

              const response = await fetch("http://localhost:3001/api/roles");

              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                const rolesData = await response.json();

                for (let i = 0; i < rolesData.data.length; i++) {
                  rolesArray.push(rolesData.data[i].title);
                }
              }

              const roleDecision = await inquirer.prompt([
                {
                  type: "list",
                  name: "role_id",
                  message: "Please select a new role for the employee",
                  //pull the roles array from above
                  choices: rolesArray,
                },
              ]);

              // get role id using the role name
              const roleIdResponse = await fetch(
                "http://localhost:3001/api/role/" + roleDecision.role_id
              );

              if (!roleIdResponse.ok) {
                return console.log("Error: " + roleIdResponse.statusText);
              } else {
                const roleIddata = await roleIdResponse.json();

                const roleId = roleIddata.data[0].id;

                updatedEmployeeObject.role_id = roleId;

                return updatedEmployeeObject;
              }
            })
            .then((updatedEmployeeObject) => {
              fetch(
                "http://localhost:3001/api/employee-role/" +
                  updatedEmployeeObject.id,
                {
                  method: "PUT",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedEmployeeObject),
                }
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert("Error: " + response.statusText);
                })
                .then((postResponse) => {
                  console.log(postResponse);
                  console.log("Employee Role has been updated in the database");
                })
                // return to menu
                .then(initializeApp);
            });
          break;
        // user selects to update the employee's manager
        case "Update An Employee's Manager":
          fetch("http://localhost:3001/api/employees")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((employeeData) => {
              const employeeNames = [];

              employeeData.data.forEach((employee) => {
                employeeNames.push(
                  employee.first_name + " " + employee.last_name
                );
              });

              return employeeNames;
            })
            .then((employeeNames) => {
              return inquirer.prompt([
                {
                  type: "list",
                  name: "employeeName",
                  message:
                    "Please select which employee you would like to update the role for.",
                  choices: employeeNames,
                },
              ]);
            })
            .then(async (selection) => {
              const employeeFirstName = selection.employeeName.split(" ")[0];
              const employeeLastName = selection.employeeName.split(" ")[1];

              const response = await fetch(
                "http://localhost:3001/api/employee/" +
                  employeeFirstName +
                  "/" +
                  employeeLastName
              );

              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                const data = await response.json();
                //pull employee ID to pass to delete route
                return data.data[0].id;
              }
            })
            .then(async (employeeId) => {
              const updatedEmployee = {};

              updatedEmployee.id = employeeId;

              return updatedEmployee;
            })
            .then(async (updatedEmployeeObject) => {
              const managersArray = [];

              const response = await fetch(
                "http://localhost:3001/api/managersgroup"
              );

              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                const managersData = await response.json();

                for (let i = 0; i < managersData.data.length; i++) {
                  managersArray.push(managersData.data[i].manager);
                }
              }

              const managerDecision = await inquirer.prompt([
                {
                  type: "list",
                  name: "manager_id",
                  message: "Please select a new manager for the employee.",
                  //pull the managers from array above
                  choices: [...new Set(managersArray.filter((item) => !!item))],
                },
              ]);

              const managerFirstName = managerDecision.manager_id.split(" ")[0];
              const managerLastName = managerDecision.manager_id.split(" ")[1];

              // get manager id using the role name
              const managerIdResponse = await fetch(
                "http://localhost:3001/api/employee/" +
                  managerFirstName +
                  "/" +
                  managerLastName
              );

              if (!managerIdResponse.ok) {
                return console.log("Error: " + managerIdResponse.statusText);
              } else {
                const managerIdData = await managerIdResponse.json();

                const managerId = managerIdData.data[0].id;

                updatedEmployeeObject.manager_id = managerId;

                return updatedEmployeeObject;
              }
            })
            .then((updatedEmployeeObject) => {
              fetch(
                "http://localhost:3001/api/employee-manager/" +
                  updatedEmployeeObject.id,
                {
                  method: "PUT",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedEmployeeObject),
                }
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert("Error: " + response.statusText);
                })
                .then((postResponse) => {
                  console.log(postResponse);
                  console.log(
                    "Employee's Manager has been updated in the database"
                  );
                })
                .then(initializeApp);
            });
          break;
        // user wants to add a department
        case "Add A Department":
          return inquirer
            .prompt([
              {
                type: "input",
                name: "dept_name",
                message:
                  "What is the name of the Department you would like to add?",
                validate: (deptNameInput) => {
                  if (deptNameInput) {
                    return true;
                  } else {
                    console.log("Please enter the name of the department!");
                    return false;
                  }
                },
              },
            ])
            .then((deptName) => {
              fetch("http://localhost:3001/api/department", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(deptName),
              })
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert("Error: " + response.statusText);
                })
                .then((postResponse) => {
                  console.log(postResponse);
                  console.log("Department has been added to the database");
                })
                // return to menu
                .then(initializeApp);
            });
        case "Delete A Department":
          fetch("http://localhost:3001/api/departments")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((departmentData) => {
              const deptsArray = [];

              for (let i = 0; i < departmentData.data.length; i++) {
                deptsArray.push(departmentData.data[i].dept_name);
              }

              return deptsArray;
            })
            .then((deptsArray) => {
              return inquirer.prompt([
                {
                  type: "list",
                  name: "dept_name",
                  message:
                    "Please select which department you would like to delete.",
                  choices: deptsArray,
                },
              ]);
            })
            .then((deptName) => {
              //get dept ID
              fetch(
                "http://localhost:3001/api/department/" + deptName.dept_name
              )
                .then((response) => {
                  if (!response.ok) {
                    return console.log("Error: " + response.statusText);
                  }
                  return response.json();
                })
                .then((deptId) => {
                  fetch(
                    `http://localhost:3001/api/department/${deptId.data[0].id}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                })
                .then(initializeApp);
            });
          break;
        // user selects to add a role
        case "Add A Role":
          // fetch the departments
          // prompt use to input title, salary and select a department
          // take object and send it post route
          fetch("http://localhost:3001/api/departments")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              }
              return response.json();
            })
            .then((departmentData) => {
              const deptsArray = [];

              for (let i = 0; i < departmentData.data.length; i++) {
                deptsArray.push(departmentData.data[i].dept_name);
              }

              return deptsArray;
            })
            .then((deptsArray) => {
              return inquirer.prompt([
                {
                  type: "input",
                  name: "title",
                  message:
                    "What is the name of the Role you would like to add?",
                  validate: (roleNameInput) => {
                    if (roleNameInput) {
                      return true;
                    } else {
                      console.log("Please enter the name of the role!");
                      return false;
                    }
                  },
                },
                {
                  type: "number",
                  name: "salary",
                  message: "What is the salary for this role?",
                  validate: (salaryInput) => {
                    if (salaryInput) {
                      return true;
                    } else {
                      console.log("Please enter the salary of the role!");
                      return false;
                    }
                  },
                },
                {
                  type: "list",
                  name: "department_id",
                  message:
                    "Please select which department you would like to delete.",
                  choices: deptsArray,
                },
              ]);
            })
            .then(async (roleObject) => {
              const deptIdResponse = await fetch(
                "http://localhost:3001/api/department/" +
                  roleObject.department_id
              );

              if (!deptIdResponse.ok) {
                return console.log("Error: " + deptIdResponse.statusText);
              } else {
                const deptIdData = await deptIdResponse.json();

                const deptId = deptIdData.data[0].id;

                roleObject.department_id = deptId;
              }

              return roleObject;
            })
            .then((roleObject) => {
              fetch("http://localhost:3001/api/role", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(roleObject),
              })
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                  alert("Error: " + response.statusText);
                })
                .then((postResponse) => {
                  console.log(postResponse);
                  console.log("Role has been added to the database");
                })
                // return to menu
                .then(initializeApp);
            });
          break;
        // user selects to delete a role
        case "Delete A Role":
          // get role names and push to roles array to display to user to select
          fetch("http://localhost:3001/api/roles")
            .then((response) => {
              if (!response.ok) {
                return console.log("Error: " + response.statusText);
              } else {
                return response.json();
              }
            })
            .then((rolesData) => {
              const rolesArray = [];

              for (let i = 0; i < rolesData.data.length; i++) {
                rolesArray.push(rolesData.data[i].title);
              }

              return rolesArray;
            })
            .then(async (rolesArray) => {
              const roleDecision = await inquirer.prompt([
                {
                  type: "list",
                  name: "role_id",
                  message: "Please select the role you wish to delete.",
                  //pull the roles array from above
                  choices: rolesArray,
                },
              ]);

              // get role id using the role name
              const roleIdResponse = await fetch(
                "http://localhost:3001/api/role/" + roleDecision.role_id
              );

              if (!roleIdResponse.ok) {
                return console.log("Error: " + roleIdResponse.statusText);
              } else {
                const roleIddata = await roleIdResponse.json();

                const roleId = roleIddata.data[0].id;

                return roleId;
              }
            })
            .then((roleId) => {
              fetch(`http://localhost:3001/api/role/${roleId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            })
            // return to menu
            .then(initializeApp);
          break;
        // if user selects to exit
        case "Exit":
          // close down server and disconnect from database
          process.exit();
      }
    });
}

module.exports = { initializeApp };
