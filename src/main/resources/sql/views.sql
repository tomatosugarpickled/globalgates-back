create view vw_file_advertisement as
select
    f.id, f.original_name, f.file_name, f.file_path, f.file_size,
    f.content_type, f.created_datetime,
    af.ad_id
from tbl_ad_file af
join tbl_file f on af.id = f.id;