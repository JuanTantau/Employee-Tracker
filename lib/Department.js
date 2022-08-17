const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db/connection');
// view all departments
const viewAllDepartments = (callback) => {
    const sql = `SELECT id, name AS department FROM departments`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        callback();
    });
};
// add department
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'Please give the department a name?',
        validate: department =>{
            if(!department){
                return false;
            }
            return true;
        }
    }).then(answer => {
        connection.query('INSERT INTO departments SET ?',
            {
                name: answer.department
            }, (err, result) => {
                if (err) throw err;
                viewAllDepartments();
            });
    });
};
//delete department
const deleteDepartment = () => {
    const sql = `SELECT * FROM departments`;
    connection.query(sql, (err, data) => {
        if (err) throw err;
        const department = data.map(({ name, id }) => ({ name: name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Please choose what you want to delete?',
                choices: department
            }
        ]).then(answer => {
            const params = answer.department;
            const sql = `DELETE FROM departments WHERE id = ?`;
            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                viewAllDepartments();
            });
        });
    });
};
const viewBudget = (callback) => {
    const sql = `SELECT department_id AS id,
    departments.name AS department,
    SUM(salary) AS budget
    FROM roles
    JOIN departments ON roles.department_id = departments.id 
    GROUP BY department_id`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        callback();
    });
};
module.exports = {viewAllDepartments, addDepartment, deleteDepartment, viewBudget};