use employee_db;
INSERT INTO department (name)
-- number value corresponds with id order -- 
VALUES ('Engineering'), ('Finance'), ('Legal'), ('Sales');

INSERT INTO
    role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 4), ('Salesperson', 80000, 4), ('Lead Engineer', 150000, 1), ('Software Engineer', 120000, 1), ('Account Manager', 160000, 2), ('Accountant', 125000, 2), ('Legal Team Lead', 250000, 3), ('Lawyer', 190000, 3);

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )

VALUES ('Alan', 'Grant', 1, null), ('Dennis', 'Nedry', 2, 1), ('Ellie', 'Sattler', 3, null), ('Ian', 'Malcom', 4, 3), ('John', 'Hammond', 5, null), ('Ray', 'Arnold', 6, 5), ('Lex', 'Murphy', 7, null), ('Tim', 'Murphy', 8, 7);