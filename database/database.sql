--drop database if exists online_exam_system;
--create database online_exam_system;


--drop schema if exists public;
--create schema public;

--alter user public set search_path to public;


-- 0 => student
-- 1 => teacher
create table role(
    role_id int,
    role_name varchar(10),
    primary key (role_id)
);

create table account(
    id serial ,
    firstname varchar(20),
    surname varchar(20),
    password text,
    role_id int,
    token text unique,
    primary key (id),
    foreign key (role_id) references role(role_id)
);

-- add right option;




-- release => true
-- release => false
create table exam(
    id serial,
    name text,
    start_date text,
    end_date text,
    prepared_id int,
    release bool,
    url text,
    primary key (id),
    foreign key (prepared_id) references account(id)
);


create table question(
    id serial,
    question_text text,
    option_a text,
    option_b text,
    option_c text,
    option_d text,
    right_option int,
    exam_id int,
    foreign key (exam_id) references exam(id),
    primary key (id)
);

create table student_taking_exam(
    student_id int,
    exam_id int,
    score float default 0,
    primary key (student_id,exam_id),
    foreign key (student_id) references account(id),
    foreign key (exam_id) references exam(id)
);

insert into role(role_id, role_name) VALUES (0,'Student');
insert into role(role_id, role_name) VALUES (1,'Teacher');

insert into account(id, firstname, surname, password, role_id, token) VALUES (123,'Burhan','Cabiroglu','0',0,'effefe');
insert into account(id, firstname, surname, password, role_id, token) VALUES (1234,'Burhan','Cabiroglu','0',1,'efseefe');
