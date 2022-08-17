-- data for the tables
INSERT INTO departments (name)
VALUES
('sales'),
('pr'),
('accounting'),
('development');

INSERT INTO roles(title, salary, department_id)
VALUES
('Marketing director',45000, 1),
('Pest controller',50000,1),
('Business consultant', 25000,2),
('Preacher',40000,2),
('Magician', 65000,3),
('Private investigator', 30000, 3),
('Optician', 80000,4),
('Window cleaner', 90000, 4),
('Bookmaker',120000,4),
('Homemaker', 180000, 4);

INSERT INTO employees(first_name,last_name,role_id,manager_id)
VALUES
('Juan','Tantau',9,NULL),
('Anna','Marianus',5,NULL),
('Winona','Embla',6,NULL),
('Murtada','Virgie',10,1),
('Eardwulf','Hadija',8,3),
('Telma','Rositsa',7,2),
('Brian','Marija',4,1),
('lug','Rehendus',3,2),
('Nikita','Yaw',2,3),
('Primus','Ffion',1,1);