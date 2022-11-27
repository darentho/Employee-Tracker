INSERT INTO departments (dept_name)
VALUES
('Executive'),
('Finance'),
('Marketing'),
('Sales'),
('IT');

INSERT INTO roles (title, salary, department_id)
VALUES
('CEO', 250000, 1),
('CFO', 230000, 1),
('CTO', 220000, 1),
('CMO', 220000, 1),
('COO', 220000, 1),
('Controller', 140000, 2),
('Assistant Controller', 110000, 2),
('Senior Accountant', 85000, 2),
('Staff Accountant', 65000, 2),
('Accounts Payable Clerk', 40000, 2),
('Accounts Receivable Clerk', 40000, 2),
('Marketing Manager', 140000, 3),
('Marketing Specialist', 90000, 3),
('Marketing Associate', 65000, 3),
('VP of Sales', 180000, 4),
('Territory Manager', 150000, 4),
('Sales Associate', 95000, 4),
('IT Manager', 180000, 5),
('Senior Web Developer', 110000, 5),
('Junior Web Developer', 75000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Derek', 'Patrick', 1, NULL),
('Vera', 'Valdez', 2, 1),
('Gail', 'Johnston', 3, 1),
('Betsy', 'Mason', 4, 1),
('Irma', 'Buchanan', 5, 1),
('Louise', 'Lawson', 6, 2),
('Rudolph', 'Andrews', 7, 6),
('Erma', 'Roy', 8, 7),
('Elena', 'Ramos', 9, 7),
('Aubrey', 'Matthews', 10, 8),
('Melanie', 'Cunningham', 10, 8),
('Antoinette', 'Stewart', 11, 8),
('Ellen', 'King', 11, 8),
('Bobby', 'Diaz', 12, 4),
('Naomi', 'Hayes', 13, 15),
('Jenna', 'Norman', 14, 16),
('Natasha', 'Reynolds', 15, 5),
('Brandy', 'Love', 16, 17),
('Raymond', 'Mccoy', 16, 17),
('Randy', 'Brewer', 17, 18),
('Jerald', 'Powers', 17, 18),
('Beth', 'Pearson', 17, 19),
('Cheryl', 'Willis', 18, 3),
('Stewart', 'Sims', 19, 23),
('Heidi', 'Mullins', 20, 23),
('Troy', 'Robertson', 20, 23);