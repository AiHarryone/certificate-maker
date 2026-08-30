# -*- coding: utf-8 -*-
"""Batch-generate Certificate Maker long-tail SEO pages.
Theme matches the site (blue gradient). SEO pages live in /seo/ so all links
are ABSOLUTE via the {base} placeholder (replaced last in render).
Run with `py gen_seo_batch.py`."""
import os

OUT = r'D:\claude\certificate-maker\seo'
os.makedirs(OUT, exist_ok=True)

BASE = 'https://aiharryone.github.io/certificate-maker'

HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="msvalidate.01" content="E62785F51D89A3BD3AFBB2BC2BB07BF9">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{base}/seo/{slug}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Certificate Maker">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta}">
<meta property="og:url" content="{base}/seo/{slug}">
<script type="application/ld+json">
{ldjson}
</script>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Trebuchet MS','Segoe UI',sans-serif;background:#f4f7fb;color:#2c3e50;line-height:1.7;}
  .wrap{max-width:880px;margin:0 auto;padding:0 22px;}
  header{background:linear-gradient(135deg,#3a7bd5,#00d2ff);color:#fff;padding:18px 0;}
  nav{display:flex;justify-content:space-between;align-items:center;}
  .logo{font-weight:bold;font-size:21px;}
  .nav-links a{color:#fff;text-decoration:none;font-weight:bold;margin-left:18px;}
  .btn{display:inline-block;background:#fff;color:#2c6ab3;text-decoration:none;padding:11px 26px;border-radius:30px;font-weight:bold;transition:.15s;border:none;cursor:pointer;}
  .btn:hover{background:#eef5ff;}
  .hero{text-align:center;padding:46px 0 26px;}
  .hero h1{font-size:34px;color:#2c3e50;margin-bottom:12px;letter-spacing:-.5px;}
  .hero p{font-size:17px;color:#7a8ea8;max-width:640px;margin:0 auto;}
  .hero .sub{font-size:14px;color:#93a5bd;margin-top:12px;}
  section{padding:26px 0;}
  h2{color:#3a7bd5;margin-bottom:14px;font-size:24px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;}
  .card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 4px 14px rgba(58,123,213,.1);}
  .card h3{color:#3a7bd5;margin-bottom:6px;font-size:17px;}
  .card p{font-size:15px;}
  ul.tips{margin:8px 0 8px 22px;}
  ul.tips li{margin:8px 0;}
  ol.steps{margin:8px 0 8px 22px;}
  ol.steps li{margin:8px 0;}
  .example{background:#fff;border-radius:14px;padding:18px 22px;box-shadow:0 4px 14px rgba(58,123,213,.1);margin-bottom:14px;}
  .example b{color:#3a7bd5;}
  .cta{text-align:center;background:linear-gradient(135deg,#3a7bd5,#00d2ff);color:#fff;border-radius:16px;padding:38px 24px;margin:22px 0;}
  .cta h2{color:#fff;margin-bottom:10px;}
  .cta p{margin-bottom:20px;font-size:16px;opacity:.95;}
  .faq p{margin-bottom:10px;background:#fff;border-radius:10px;padding:14px 18px;}
  .faq b{color:#2c6d8f;}
  .related{margin-top:34px;background:#fff;border-radius:14px;box-shadow:0 4px 14px rgba(58,123,213,.1);padding:24px;}
  .related h2{font-size:20px;margin-bottom:12px;}
  .related a{display:inline-block;background:#eef5ff;color:#2c6ab3;border-radius:20px;padding:6px 14px;margin:4px 6px 0 0;text-decoration:none;font-size:14px;font-weight:bold;}
  footer{background:#2c3e50;color:#a8bdc9;padding:24px 0;text-align:center;font-size:13px;margin-top:36px;}
  footer a{color:#7ec8e3;text-decoration:none;}
  @media(max-width:600px){.hero h1{font-size:27px;}.btn{display:block;margin:8px 0;text-align:center;}}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="logo">🏆 Certificate Maker</div>
    <div class="nav-links">
      <a href="{base}/index.html">Maker</a>
      <a href="{base}/certificate-of-completion-template.html">Completion</a>
      <a class="btn" href="{base}/index.html">Make One Free →</a>
    </div>
  </div>
</header>

<div class="wrap">
  <div class="hero">
    <h1>{h1}</h1>
    <p>{hero_p}</p>
    <p class="sub">Free in your browser · No signup · Printable</p>
  </div>

  {sections}

  <div class="cta">
    <h2>{cta_h2}</h2>
    <p>{cta_p}</p>
    <a class="btn" href="{base}/index.html" style="font-size:16px;">Make Your Certificate Now — Free →</a>
  </div>

  <div class="related">
    <h2>More Certificate Templates</h2>
    {related}
    <p style="margin-top:14px;font-size:13px;color:#93a5bd;">Everything is made in your browser — nothing is uploaded, no account needed.</p>
  </div>
</div>

<footer>
  Made for teachers, trainers and creators who value beautiful certificates. Questions? Ai_harryone@outlook.com · <a href="{base}/index.html">Certificate Maker</a> · <a href="{base}/privacy.html">Privacy</a> · <a href="{base}/terms.html">Terms</a>
</footer>
</body>
</html>
'''

def faq_block(items):
    return '<section class="faq">\n<h2>FAQ</h2>\n%s</section>' % ''.join('<p><b>%s</b> %s</p>' % (q, a) for q, a in items)

def ldjson(items):
    qa = []
    for q, a in items:
        qa.append('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}' % (q.replace('"', '\\"'), a.replace('"', '\\"')))
    return '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[%s]}' % ','.join(qa)

def sec(title, body):
    return '<section>\n<h2>%s</h2>\n%s\n</section>' % (title, body)

def card(h3, p):
    return '<div class="card"><h3>%s</h3><p>%s</p></div>' % (h3, p)

def _ld_for(sections):
    import re
    faq_section = [s for s in sections if s.startswith('<section class="faq">')]
    if not faq_section:
        return ''
    items = re.findall(r'<p><b>(.*?)</b> (.*?)</p>', faq_section[0])
    return ldjson(items)

def tpage(slug, title, meta, h1, hero, sections, faq, cta_h2, cta_p):
    s = list(sections) + [faq_block(faq)]
    return {'slug': slug, 'title': title, 'meta': meta, 'h1': h1, 'hero_p': hero,
            'sections': s, 'cta_h2': cta_h2, 'cta_p': cta_p}

PAGES = [
  tpage('award-certificate-template.html',
    'Award Certificate Template — Free, Editable & Printable',
    'Free award certificate templates you can edit and print: employee, student, sports and achievement awards. Make one in your browser in 30 seconds.',
    'Award Certificate Template',
    'Edit and print a professional award certificate in your browser — in 30 seconds.',
    [sec('What Makes a Good Award Certificate', '<p>An award certificate needs three things: the <b>name of the recipient</b>, the <b>reason for the award</b>, and a <b>clean, confident design</b>. Everything else — colors, borders, fonts — should make it feel like an event, not a document.</p>'),
     sec('What to Include', '<div class="grid">%s</div>' % (card('Recipient name', 'The centerpiece — make it large and elegant.') + card('Award reason', 'One clear line: “for outstanding performance”, “first place”.') + card('Date & signature', 'Adds authenticity; a signature line makes it feel official.') + card('Your branding', 'School, company or event name and logo.'))),
     sec('How to Make One in 30 Seconds', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick an award template and type the recipient, reason and date.',
        'Choose colors and a border that fit the occasion.',
        'Download a print-ready PNG.'
      ]))],
    [('Is it free?','Yes — the free template is free to use; premium templates unlock for a one-time $7.'),
     ('Can I edit the text?','Yes — every field is editable in your browser.'),
     ('Can I print it?','Yes — download a high-res PNG and print at any size.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Award Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),
  tpage('certificate-generator-online-free.html',
    'Certificate Generator Online Free — Make Any Certificate',
    'A free online certificate generator: type the details, pick a template, download a print-ready certificate. Works in your browser, nothing uploaded.',
    'Certificate Generator Online',
    'Turn a few details into a beautiful certificate — free, in your browser.',
    [sec('Why an Online Generator', '<p>Designing a certificate by hand takes a design tool and a blank canvas. A generator does the layout for you: you type the <b>name, reason and date</b>, pick a style, and it produces a print-ready certificate in seconds.</p>'),
     sec('What You Can Generate', '<div class="grid">%s</div>' % (card('Completion', 'Courses, workshops, training programs.') + card('Awards', 'Employee, student, sports and recognition awards.') + card('Achievement', 'Certificates of achievement and excellence.') + card('Custom', 'Any occasion — you edit every field.'))),
     sec('How It Works', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Choose a template and fill in the details.',
        'Adjust colors and style.',
        'Download as a high-res PNG, ready to print or share.'
      ]))],
    [('Is it really free?','Yes — the free template is free; premium is a one-time $7 unlock.'),
     ('Do I need to sign up?','No — no account, no email.'),
     ('What can I download?','A print-ready PNG at 1200×850.'),
     ('Is my data uploaded?','No — everything is generated in your browser.')],
    'Generate a Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),
  tpage('recognition-certificate-template.html',
    'Recognition Certificate Template — Employee & Team Awards',
    'Recognition certificate templates for employees and teams: editable, printable and professional. Make one free in your browser.',
    'Recognition Certificate Template',
    'Recognize great work with a clean, editable certificate — in your browser.',
    [sec('Recognition Is a Keepsake', '<p>A recognition certificate is more than a document — it’s the physical proof of being appreciated. A well-designed one gets framed, photographed and shared. That’s why the design matters.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Employee or team name</b> — the reason people keep it.',
        '<b>The specific reason</b> — “for consistently exceeding targets”, not a generic line.',
        '<b>Company name and logo</b> — makes it feel official.',
        '<b>Date and signature</b> — adds weight and authenticity.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a recognition template.',
        'Type the employee name, reason, company and date.',
        'Download and print — or email the PDF/PNG.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add a company logo?','Yes — upload your logo in the editor.'),
     ('Can I print it?','Yes — high-res PNG download, print at any size.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Recognition Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),
  tpage('participation-certificate-template.html',
    'Participation Certificate Template — Free & Editable',
    'Participation certificate templates: events, workshops and webinars. Edit, print and hand them out. Free, in your browser.',
    'Participation Certificate Template',
    'Thank attendees with a clean participation certificate — made in seconds.',
    [sec('Participation Certificates Work', '<p>Participation certificates are the simplest, most appreciated handout — events, webinars, workshops and classes use them to say “you showed up and that matters”. The key is speed: you need many, and you need them identical.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Participant name</b> — the personal touch.',
        '<b>Event name and date</b> — what they attended.',
        '<b>Your organization</b> — who is certifying.',
        '<b>Keep it clean</b> — a participation certificate should feel generous, not formal.'
      ])),
     sec('How to Make Many Fast', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick the participation template and fill in your event details.',
        'Generate one, then repeat for each name — it takes seconds each.',
        'Download and print the batch.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I make many at once?','Each takes ~30 seconds; generate as many as you need.'),
     ('Can I print them?','Yes — print-ready high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Participation Certificate Now.',
    'Free to try — no signup.'),
  tpage('graduation-certificate-template.html',
    'Graduation Certificate Template — Editable & Printable',
    'Graduation certificate templates for courses, programs and classes: editable, printable and elegant. Make one free in your browser.',
    'Graduation Certificate Template',
    'A certificate that makes completion feel like an achievement — in your browser.',
    [sec('The Graduation Moment', '<p>Whether it’s a course, a bootcamp or a summer program, a graduation certificate turns “you finished” into “you achieved”. A formal, elegant design makes it feel like a real milestone.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Graduate name</b> — prominent and elegant.',
        '<b>Program or course name</b> — what they completed.',
        '<b>Date of completion</b> — the milestone moment.',
        '<b>Instructor or institution</b> — adds authority.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Choose the graduation template.',
        'Type the name, program, date and institution.',
        'Download a print-ready certificate.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I edit all the text?','Yes — every field is editable.'),
     ('Can I print it?','Yes — high-res PNG, print at any size.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Graduation Certificate Now.',
    'Free to try — no signup.'),
  tpage('certificate-of-achievement-template.html',
    'Certificate of Achievement Template — Free Download',
    'Certificate of achievement templates: student, employee and athlete awards. Editable, printable and free to make in your browser.',
    'Certificate of Achievement Template',
    'Celebrate a real achievement with a certificate they’ll keep.',
    [sec('Why Achievements Need Certificates', '<p>An achievement — a grade, a record, a milestone — deserves more than a verbal “well done”. A certificate makes it permanent and shareable. The best ones are specific: name, achievement, date.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Name of the achiever</b> — the centerpiece.',
        '<b>The specific achievement</b> — “for ranking first in the class”.',
        '<b>Date</b> — anchors the moment.',
        '<b>Signature or seal</b> — makes it feel official.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick the achievement template.',
        'Type the name, achievement and date.',
        'Download and print.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I edit it?','Yes — every field is editable in your browser.'),
     ('Can I print it?','Yes — print-ready high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Achievement Certificate Now.',
    'Free to try — no signup.'),
  tpage('appreciation-certificate-template.html',
    'Appreciation Certificate Template — Thank-You Awards',
    'Appreciation certificate templates to say thank you: volunteers, staff, mentors and donors. Editable and printable, free in your browser.',
    'Appreciation Certificate Template',
    'Say thank you with a certificate that feels like more than an email.',
    [sec('Appreciation Worth Framing', '<p>An appreciation certificate is a thank-you that lasts. Volunteers, mentors, staff and donors all keep them. The design should feel warm — a touch of gold, a clean layout, and a sincere message.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Name of the person</b> — appreciation is personal.',
        '<b>The specific contribution</b> — “for two years of volunteer service”.',
        '<b>Your organization</b> — who is saying thanks.',
        '<b>A warm closing</b> — “With sincere gratitude”.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Choose the appreciation template.',
        'Type the name, contribution and organization.',
        'Download a print-ready certificate.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add a message?','Yes — you control all the text.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Appreciation Certificate Now.',
    'Free to try — no signup.'),
  tpage('blank-certificate-template-printable.html',
    'Blank Certificate Template — Printable & Fillable',
    'Blank certificate templates you can print and fill by hand: completion, award and recognition layouts. Free to customize in your browser.',
    'Blank Certificate Template',
    'A clean printable certificate — type or print and fill by hand.',
    [sec('Blank Can Be Better', '<p>Sometimes you want a certificate ready before you know the names — a printed blank you can fill by hand, or a template for repeated use. A clean blank layout works for both.</p>'),
     sec('Uses for a Blank Template', '<div class="grid">%s</div>' % (card('Handwritten awards', 'Print blanks and write names in pen — personal and fast.') + card('Reusable designs', 'One template, filled differently every time.') + card('Events', 'Fill names on the spot.') + card('Kids & classrooms', 'Teachers and parents both use blanks.'))),
     sec('How to Get a Blank Certificate', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a template and leave the name field blank.',
        'Set your design and colors.',
        'Download and print as many as you need.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I print a blank?','Yes — just leave the name empty and print.'),
     ('Can I fill it by hand?','Yes — or type names and regenerate.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Blank Certificate Now.',
    'Free to try — no signup.'),
  tpage('course-completion-certificate-template.html',
    'Course Completion Certificate Template — Free for Online Courses',
    'Course completion certificate templates for online courses, workshops and training. Editable, printable, free in your browser.',
    'Course Completion Certificate Template',
    'Give your students proof of progress they’ll actually keep.',
    [sec('Certificates Help Courses Convert', '<p>A completion certificate is a proven motivator — students finish courses that offer one. It’s also the credential they show employers. A clean, branded certificate makes your course feel more professional than a PDF they could fake.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Student name</b> — the personal credential.',
        '<b>Course title</b> — exactly what they completed.',
        '<b>Hours or level</b> — adds credibility (e.g. “10 hours”).',
        '<b>Instructor and date</b> — authority and timing.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick the completion template.',
        'Type student name, course title, hours and date.',
        'Download — then email or hand out each one.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add my course branding?','Yes — upload your logo and set your colors.'),
     ('Can I batch them?','Each takes ~30 seconds; generate one per student.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Course Completion Certificate Now.',
    'Free to try — no signup.'),
  tpage('employee-of-the-month-certificate.html',
    'Employee of the Month Certificate Template — Free',
    'Employee of the month certificate templates: editable, printable and professional. Recognize standout staff in your browser, free.',
    'Employee of the Month Certificate',
    'Make the recognition real with a certificate they’ll frame.',
    [sec('The Recognition That Sticks', '<p>“Employee of the month” is only meaningful if it’s visible. A printed, framed certificate on the wall is visible every day — a real motivator for the winner and a signal to everyone else.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Employee name</b> — the centerpiece.',
        '<b>Month and year</b> — makes it a collectible.',
        '<b>The reason</b> — “for outstanding service in January”.',
        '<b>Company name and signature</b> — official and personal.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick the employee award template.',
        'Type the name, month, reason and company.',
        'Download and print for the wall.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add a company logo?','Yes — upload it in the editor.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Employee of the Month Certificate Now.',
    'Free to try — no signup.'),
  tpage('teacher-appreciation-certificate.html',
    'Teacher Appreciation Certificate Template — Free',
    'Teacher appreciation certificate templates: thank the teacher who made a difference. Editable, printable and free in your browser.',
    'Teacher Appreciation Certificate',
    'A warm, printable way to say thank you to a great teacher.',
    [sec('A Teacher Remembers It', '<p>A teacher appreciation certificate from a student or a school board is a keepsake — teachers keep them for years. The design should feel warm and slightly formal, not corporate.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Teacher name</b> — the reason this is special.',
        '<b>Why</b> — “for inspiring a love of learning”.',
        '<b>From whom</b> — a student, a class, or the school.',
        '<b>Date</b> — the year of the thank-you.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a warm, simple template.',
        'Type the teacher name, reason and date.',
        'Download and print — or send as an image.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I edit the message?','Yes — all text is editable.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Teacher Appreciation Certificate Now.',
    'Free to try — no signup.'),
  tpage('sports-award-certificate.html',
    'Sports Award Certificate Template — Team & Player Awards',
    'Sports award certificate templates: MVP, champion, participation and coach awards. Editable, printable and free in your browser.',
    'Sports Award Certificate',
    'MVP, champion, participation — award certificates for every role on the team.',
    [sec('Every Player Gets One', '<p>From MVP to “most improved” to participation, sports certificates make every player feel recognized. A clean design with room for the team name and the specific award is all you need.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Player name</b> — the award belongs to them.',
        '<b>The specific award</b> — “MVP”, “Most Improved”, “Champions”.',
        '<b>Team and season</b> — anchors it in time.',
        '<b>Coach signature</b> — personal and authentic.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a sports template.',
        'Type player name, award, team and season.',
        'Download and print for the end-of-season ceremony.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add a team logo?','Yes — upload it.'),
     ('Can I print many?','Yes — one per player, seconds each.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Sports Award Certificate Now.',
    'Free to try — no signup.'),
  tpage('training-certificate-template.html',
    'Training Certificate Template — Workshop & Seminar',
    'Training certificate templates for workshops, seminars and internal training. Editable, printable and free in your browser.',
    'Training Certificate Template',
    'Certificates for workshops, seminars and in-house training.',
    [sec('Training Needs Proof', '<p>Workshops and seminars issue certificates as proof of attendance and completion. A professional template with room for the session name, date and the participant’s name is the standard deliverable.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Participant name</b> — their credential.',
        '<b>Training title</b> — “Data Privacy Workshop”.',
        '<b>Duration or hours</b> — adds credibility.',
        '<b>Trainer and date</b> — who and when.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a training template.',
        'Type participant, course, hours and trainer.',
        'Download and hand them out.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I add my company logo?','Yes — upload it.'),
     ('Can I batch them?','Each takes ~30 seconds.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Training Certificate Now.',
    'Free to try — no signup.'),
  tpage('volunteer-certificate-template.html',
    'Volunteer Certificate Template — Thank You for Service',
    'Volunteer certificate templates to thank and recognize volunteers: hours, service and impact. Editable, printable, free in your browser.',
    'Volunteer Certificate',
    'Recognize volunteer service with a certificate they’ll keep.',
    [sec('Volunteers Deserve More Than Thanks', '<p>Volunteers donate their time; a certificate documents it. Many use them for resumes and community records. The design should be warm and genuinely grateful — not corporate.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Volunteer name</b> — personal recognition.',
        '<b>The service</b> — “for 120 hours of community service”.',
        '<b>The organization</b> — who is grateful.',
        '<b>Date and signature</b> — official and warm.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a volunteer template.',
        'Type the name, service, organization and date.',
        'Download and print.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I list hours?','Yes — include them in the text.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Volunteer Certificate Now.',
    'Free to try — no signup.'),
  tpage('how-to-make-a-certificate-online.html',
    'How to Make a Certificate Online — Free, in 3 Steps',
    'How to make a certificate online free: choose a template, add the details, download and print. No design skills, no software, nothing uploaded.',
    'How to Make a Certificate Online',
    'A professional certificate in 3 steps — no design skills, no software.',
    [sec('The 3 Steps', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Choose a template</b> — completion, award, recognition, participation and more.',
        '<b>Type the details</b> — recipient name, reason, date, your organization.',
        '<b>Download and print</b> — a high-res PNG, ready for paper or sharing.'
      ])),
     sec('What You Need (Almost Nothing)', '<p>Just the recipient’s name and the occasion. Everything else — the layout, borders, typography — is handled by the template. You can adjust colors and fonts, but you don’t have to.</p>'),
     sec('Tips for a Professional Result', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Spell the name correctly</b> — the one thing everyone checks.',
        '<b>Be specific</b> — “for completing the 2026 Sales Training” beats a generic line.',
        '<b>Keep it clean</b> — one accent color and a clear border reads more professional.',
        '<b>Print on good paper</b> — card stock makes any certificate feel premium.'
      ])),
     sec('Make One Now', '<p>Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a> — free, no signup, nothing uploaded. Your first certificate is 30 seconds away.</p>')],
    [('Is making certificates free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Do I need design software?','No — everything runs in your browser.'),
     ('Can I print it?','Yes — download a high-res PNG.'),
     ('Is my data uploaded?','No — everything is generated locally.')],
    'Make a Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),
  tpage('student-of-the-month-certificate.html',
    'Student of the Month Certificate Template — Free',
    'Student of the month certificate templates: award outstanding students. Editable, printable and free in your browser.',
    'Student of the Month Certificate',
    'Award outstanding students with a certificate they’ll show home.',
    [sec('Why It Matters', '<p>“Student of the month” rewards effort and behavior — not just grades. A certificate they take home makes the recognition visible to parents and gives the student a real keepsake.</p>'),
     sec('What to Include', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Student name</b> — the star.',
        '<b>Month and reason</b> — “for kindness and hard work in February”.',
        '<b>Class or grade</b> — context.',
        '<b>Teacher signature</b> — personal.'
      ])),
     sec('How to Make One', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick a student award template.',
        'Type the name, month, reason and teacher.',
        'Download and print.'
      ]))],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I edit it?','Yes — every field is editable.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Student of the Month Certificate Now.',
    'Free to try — no signup.'),
  tpage('printable-certificate-templates.html',
    'Printable Certificate Templates — Free & Editable',
    'Free printable certificate templates: completion, award, recognition and more. Edit in your browser, download and print. Nothing uploaded.',
    'Printable Certificate Templates',
    'Edit in your browser, print on good paper — a full library of templates.',
    [sec('The Full Library', '<div class="grid">%s</div>' % (card('Completion', 'Courses, workshops and training.') + card('Awards', 'Employee, student and sports awards.') + card('Recognition', 'Thank-you and appreciation.') + card('Participation', 'Events, webinars and classes.'))),
     sec('Why Printable Matters', '<p>A printable certificate is a physical object — it gets framed, pinned to corkboards, photographed for LinkedIn. The design must hold up on paper: clean borders, balanced layout, enough resolution. Certificate Maker exports print-ready PNGs.</p>'),
     sec('How to Print Like a Pro', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in [
        '<b>Print on card stock</b> — 250gsm+ feels premium.',
        '<b>Use borderless printing</b> if your template has a full-bleed border.',
        '<b>Check the preview</b> — the PNG preview shows exactly what prints.',
        '<b>Keep a digital copy</b> — the PNG is also great for email and sharing.'
      ]))],
    [('Are these templates free?','Yes — the free template is free; premium unlocks for a one-time $7.'),
     ('Can I edit them?','Yes — every field and color is editable.'),
     ('What format do I get?','A print-ready PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Browse the Templates Now.',
    'Free to try — no signup, nothing uploaded.'),
]

def render(page):
    html = HEAD
    subs = {
        '{title}': page['title'], '{meta}': page['meta'], '{slug}': page['slug'],
        '{ldjson}': _ld_for(page['sections']), '{h1}': page['h1'], '{hero_p}': page['hero_p'],
        '{sections}': '\n\n'.join(page['sections']),
        '{cta_h2}': page['cta_h2'], '{cta_p}': page['cta_p'],
    }
    for k, v in subs.items():
        if k == '{base}':
            continue
        html = html.replace(k, v)
    html = html.replace('{base}', BASE)
    return html

def related_links(slug):
    items = ['<a href="{base}/certificate-of-completion-template.html">Completion</a>',
             '<a href="{base}/index.html">Certificate Maker</a>']
    for p in PAGES:
        if p['slug'] != slug:
            items.append('<a href="{base}/seo/%s">%s</a>' % (p['slug'], p['h1'].split(' — ')[0].split(' Template')[0]))
    return '\n    '.join(items)

def main():
    seen = set()
    for p in PAGES:
        if p['slug'] in seen:
            print('!! duplicate slug', p['slug']); continue
        seen.add(p['slug'])
        html = render(p)
        html = html.replace('{related}', related_links(p['slug']))
        html = html.replace('{base}', BASE)  # related links embed {base}; resolve after insertion
        with open(os.path.join(OUT, p['slug']), 'w', encoding='utf-8') as f:
            f.write(html)
        print('wrote', p['slug'], len(html), 'bytes')
    print('done —', len(PAGES), 'pages')

if __name__ == '__main__':
    main()
