const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db/connection');

// view all roles
const viewAllRoles = (callback) => {

    // query to view roles
    const sql = `SELECT roles.id, roles.title, roles.salary,departments.name AS department FROM roles
    LEFT JOIN departments
    ON roles.department_id = departments.id`;
    connection.query(sql, (err, rows) => {
        console.table(rows);
        callback();
    });
};

// add role
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'PLease select the new job title?',
            validate: title =>{
                if(!title){
                    return false;
                }
                return true;
            }
            
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Please select a salary?',
            validate: salary =>{
                if(!salary){
                    return false;
                }
                return true;
            }
        }
    ]).then(answer => {
        const params = [answer.title, answer.salary];

        const sql = `SELECT id, name FROM departments`;

        connection.query(sql, (err, data) => {
            if (err) {
            }
            const department = data.map(({ name, id }) => ({ name: name, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department is this role in?',
                    choices: department
                }
            ]).then(dep => {
                const department = dep.department;
                params.push(department);

                const sql = `INSERT INTO roles (title,salary,department_id) VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, result) => {
                    if (err) {
                    }
                    console.log(`Added ${answer.title} to the roles!`);
                    viewAllRoles();
                });
            });
        });
    });
};


// delete role
const deleteRole = () => {
    const sql = `SELECT * FROM roles`;
    connection.query(sql, () => {
        const roles = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'please select a role to delete?',
                choices: roles
            }
        ]).then(answer => {
            const params = answer.role;
            const sql = `DELETE FROM roles WHERE id = ?`;

            connection.query(sql, params, () => {
                if (err) throw err;

                viewAllRoles();
            })
        })
    })
}
module.exports= {
    viewAllRoles,addRole,deleteRole
}