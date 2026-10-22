-- SEO: shorter, keyword-first case-study titles and in-range social titles (2026-10-22).
-- NOT YET APPLIED. Running this changes the live site immediately (CMS values win over code).
-- Titles already end in "| Graphxify", so the code does not append the brand again.
-- Rendered lengths after the change: titles 43-54 chars, social titles 40-52 chars.

begin;

update works set meta_title = 'B.O.S.S. Medical Clinic Website Case Study | Graphxify',
                 og_title   = 'B.O.S.S. Medical Clinic Website Design | Graphxify'      where slug = 'boss-medical-clinic';
update works set meta_title = 'FlyUp Line Travel Website Case Study | Graphxify',
                 og_title   = 'FlyUp Line Travel Brand & Website | Graphxify'           where slug = 'flyup-line';
update works set meta_title = 'King Medical Arts Pharmacy Case Study | Graphxify',
                 og_title   = 'King Medical Arts Pharmacy Website | Graphxify'          where slug = 'king-medical-art-pharmacy';
-- No Luka website exists, so the share title no longer says "Web Design".
update works set meta_title = 'Luka Hair Salon Branding Case Study | Graphxify',
                 og_title   = 'Luka Hair Salon Brand Identity | Graphxify'              where slug = 'luka-hair-salon';
update works set meta_title = 'Maven Brand Identity Case Study | Graphxify',
                 og_title   = 'Maven Fashion Brand Identity | Graphxify'                where slug = 'maven';
update works set meta_title = 'Pharmacy On King Website Case Study | Graphxify',
                 og_title   = 'Pharmacy On King Website Design | Graphxify'             where slug = 'pharmacy-on-king';

update posts set og_title = 'Custom Web Development vs WordPress | Graphxify',
                 twitter_title = 'Custom Web Development vs WordPress | Graphxify'      where slug = 'custom-web-development-vs-wordpress';
update posts set og_title = 'How a Professional Website Drives Growth | Graphxify',
                 twitter_title = 'How a Professional Website Drives Growth | Graphxify' where slug = 'professional-website-business-growth';

commit;

-- Rollback (values as of 2026-10-22):
-- update works set meta_title='B.O.S.S. Medical Clinic — Healthcare Case Study | Graphxify', og_title='B.O.S.S. Medical Clinic — Healthcare Web Design | Graphxify' where slug='boss-medical-clinic';
-- update works set meta_title='FlyUp Line — Travel Platform Case Study | Graphxify', og_title='FlyUp Line — Travel Platform Redesign | Graphxify' where slug='flyup-line';
-- update works set meta_title='King Medical Arts Pharmacy — Case Study | Graphxify', og_title='King Medical Arts Pharmacy — Healthcare Web Design | Graphxify' where slug='king-medical-art-pharmacy';
-- update works set meta_title='Luka Hair Salon — Salon Branding Case Study | Graphxify', og_title='Luka Hair Salon — Beauty Brand & Web Design | Graphxify' where slug='luka-hair-salon';
-- update works set meta_title='Maven — Fashion Brand Identity Case Study | Graphxify', og_title='Maven — Fashion Brand Identity | Graphxify' where slug='maven';
-- update works set meta_title='Pharmacy On King — Pharmacy Website Case Study | Graphxify', og_title='Pharmacy On King — Healthcare Web Design | Graphxify' where slug='pharmacy-on-king';
-- update posts set og_title='Custom Web Development vs WordPress for Business Owners | Graphxify', twitter_title='Custom Web Development vs WordPress for Business Owners | Graphxify' where slug='custom-web-development-vs-wordpress';
-- update posts set og_title='How a Professional Website Drives Business Growth | Graphxify', twitter_title='How a Professional Website Drives Business Growth | Graphxify' where slug='professional-website-business-growth';
