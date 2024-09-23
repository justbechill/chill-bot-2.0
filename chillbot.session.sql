

-- @block
insert into servers(id)
values(1252472270115311687)

-- @block
alter table servers modify id varchar(20);

-- @block
alter table servers drop id;

-- @block
select * from servers where id = 824101797160419348

-- @block
UPDATE servers SET messageChannel=824101797160419351,  countingChannel=937929319253168218,  currentNumber=0,  requiredPermLevel='everyone',  requiredPermBitflag='SendMessages',  lastCounter=464864064749961229 WHERE id = 824101797160419348

-- @block
UPDATE servers set lastCounter = 0 where id = 824101797160419348