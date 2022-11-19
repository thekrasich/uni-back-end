INSERT INTO departments.faculty(name)
VALUES ('Foreign Languages'),
       ('Physics'),
       ('Applied Mathematics and Informatics');

INSERT INTO departments.department(faculty_id, name)
VALUES (1, 'Classical Philology'),
       (1, 'English Philology'),
       (1, 'Foreign Languages for Sciences'),
       (2, 'Astrophysics'),
       (2, 'Experimental Physics'),
       (2, 'General Physics'),
       (3, 'Applied Mathematics'),
       (3, 'Computational Mathematics'),
       (3, 'Cybersecurity');