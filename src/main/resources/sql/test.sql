select * from tbl_advertisement;

select * from tbl_member;

select * from tbl_file;

select * from tbl_ad_file;


insert into tbl_member (member_email, member_nickname, member_handle, member_phone, member_bio, member_region, member_status, member_role)
values ('example@example.com', 'example', '@example', '01012345678', 'TEST USER', 'Asia', 'active', 'business');