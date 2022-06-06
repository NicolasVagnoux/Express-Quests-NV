create database fullstack_example;

use fullstack_example;

create table students(
id int not null auto_increment primary key,
firstname varchar(100),
lastname varchar(100)
);

insert into students
(firstname)
values ('antso'), ('astrid'), ('nicolas'), ('geoffrey'), ('rémi'), ('jacques'), 
('johnny'), ('alexis'), ('nawel'), ('stefan'), 
('aitor'), ('gavin'), ('quentin'), ('fred'), ('estelle'), ('lucas'),('damien');