const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db/connection');

// show all employees
const viewAllEmployees = (callback) => {
    const sql = `SELECT employees.id, CONCAT(employees.first_name,' ', employees.last_name) AS employee, roles.title, roles.salary, departments.name AS department, CONCAT(e2.first_name,' ', e2.last_name) AS manager
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id;
    LEFT JOIN departments
    ON roles.department_id = departments.id;
    LEFT JOIN employees e2
    ON employees.manager_id = e2.id;
    ORDER BY employees.id`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        callback();
    });
};

// new employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Please input employee's first name?",
            validate: first_name =>{
                if(!first_name){
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Please input employees's last name?",
            validate: last_name =>{
                if(!last_name){
                    return false;
                }
                return true;
            }
        }
    ]).then(answer => {
        const params = [answer.first_name, answer.last_name];
        const sql = `SELECT roles.id, roles.title FROM roles`;

        connection.query(sql, (err, data) => {
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Please select the employee's role?",
                    choices: roles
                }
            ]).then(answer => {
                const role = answer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                connection.query(sql, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Please select who is the employee's manager?",
                            choices: managers
                        }
                    ]).then(answer => {
                        const manager = answer.manager;
                        params.push(manager);
                        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                        connection.query(sql, params, () => {
                            if (err) throw err;
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};
// update employee role
const updateEmployeeRole = () => {
    const sql = `SELECT * FROM employees`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select a employee to update?',
                choices: employees
            }
        ]).then(answer => {
            const employee = answer.name;
            const params = [];
            params.push(employee);

            const sql = `SELECT * FROM roles`;

            connection.query(sql, () => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Please select what the new role is for the employee?",
                        choices: roles
                    }
                ]).then(answer => {
                    const role = answer.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role;
                    params[1] = employee;

                    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                    connection.query(sql, params, () => {
                        if (err) throw err;

                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

// update employee manager
const updateEmployeeManager = () => {
    const sql = `SELECT * FROM employees`;

    connection.query(sql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select an employee to update?',
                choices: employees
            }
        ]).then(answer => {
            const employee = answer.name;
            const params = [];
            params.push(employee);

            const sql = `SELECT * FROM employees`;

            connection.query(sql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "please select who is the employees manager?",
                        choices: managers
                    }
                ]).then(answer => {
                    const manager = answer.manager;
                    params.push(manager);
                    let employee = params[0];
                    params[0] = manager;
                    params[1] = employee;

                    const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
                    connection.query(sql, params, () => {
                        if (err) throw err;

                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

const viewEmployeeByDepartment = (callback) => {
    const sql = `SELECT employees.first_name,
    employees.last_name,
    departments.name AS department
    FROM employees
    LEFT JOIN roles on employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    ORDER BY departments.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        callback();
    });
};

// delete employee
const deleteEmployee = () => {
    const sql = `SELECT * FROM employees`;

    connection.query(sql, (err, data) => {

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Please select an employee to delete?',
                choices: employees
            }
        ]).then(answer => {
            const params = answer.name;
            const sql = `DELETE FROM employees WHERE id = ?`;

            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                viewAllEmployees();
            });
        });
    });
};

module.exports = { viewAllEmployees, addEmployee, updateEmployeeManager,updateEmployeeRole, viewEmployeeByDepartment, deleteEmployee };