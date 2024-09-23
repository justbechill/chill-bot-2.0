

-- @block
insert into servers(id, messageChannel, countingChannel, currentNumber, lastNumber, requiredPermLevel, requiredPermBitflag)
values(824101797160419348, 824101797160419351, 937929319253168218, 1, 0, "everyone", "SendMessages")

-- @block
alter table servers add column id varchar(18) primary key;
alter table servers modify messageChannel varchar(18);
alter table servers modify countingChannel varchar(18);
alter table servers add column logChannel varchar(18);

-- @block
alter table servers drop id;

-- @block
select * from servers;
 