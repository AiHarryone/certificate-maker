# -*- coding: utf-8 -*-
"""Batch-generate Certificate Maker SEO pages — DIFFERENTIATED content.
Each page leads with copy-paste WORDS for that certificate type (the real
search intent), then type-specific fields + varied tips. No two pages share
the same skeleton. Run with `py gen_seo_batch.py`."""
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
  .quote{background:#eef5ff;border-left:4px solid #3a7bd5;border-radius:8px;padding:12px 18px;margin-bottom:10px;font-size:15px;color:#2c3e50;}
  .quote i{color:#5a7ea0;}
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

def words(items):
    """Render copy-paste wording blocks: list of (tone, phrase)."""
    return ''.join('<div class="quote"><b>%s</b><br><i>%s</i></div>' % (tone, phrase) for tone, phrase in items)

def _ld_for(sections):
    import re
    faq_section = [s for s in sections if s.startswith('<section class="faq">')]
    if not faq_section:
        return ''
    items = re.findall(r'<p><b>(.*?)</b> (.*?)</p>', faq_section[0])
    return ldjson(items)

def build(slug, title, meta, h1, hero, wording_label, wording, fields, fields_title, tip_title, tips, faq, cta_h2, cta_p, extra=None):
    """Build a differentiated page: wording first, then fields, tips, tool steps, FAQ."""
    sections = [sec(wording_label, words(wording))]
    if fields:
        sections.append(sec(fields_title or 'What to Put on Your Certificate', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in fields)))
    if tips:
        sections.append(sec(tip_title or 'Tips That Make It Feel Real', '<ul class="tips">%s</ul>' % ''.join('<li>%s</li>' % x for x in tips)))
    if extra:
        sections.append(sec(extra[0], extra[1]))
    sections.append(sec('Make It in Your Browser in 30 Seconds', '<ol class="steps">%s</ol>' % ''.join('<li>%s</li>' % x for x in [
        'Open <a href="{base}/index.html" style="color:#2c6ab3;font-weight:bold;">Certificate Maker</a>.',
        'Pick this template and type the name, reason and date.',
        'Paste one of the wordings above into the description.',
        'Download a print-ready PNG.'
    ])))
    sections.append(faq_block(faq))
    return {'slug': slug, 'title': title, 'meta': meta, 'h1': h1, 'hero_p': hero, 'sections': sections, 'cta_h2': cta_h2, 'cta_p': cta_p}

PAGES = [
  build('award-certificate-template.html',
    'Award Certificate Template + Wording to Copy (Free)',
    'Award certificate template with ready-to-copy wording: employee, student and sports awards. Edit in your browser and print. Free, nothing uploaded.',
    'Award Certificate Template & Wording',
    'A template plus the exact wording that makes an award feel earned.',
    'Copy-Paste Award Wording',
    [('Formal award', 'This certificate is proudly presented to [Name] for outstanding performance and achievement.'),
     ('Specific / results', 'Awarded to [Name] for exceeding the [quarter] sales target by [120]% and delivering [milestone].'),
     ('Project completion', 'Presented to [Name] in recognition of exceptional leadership in the successful completion of [Project], delivered on time and on budget.'),
     ('Academic', 'Awarded to [Name] for outstanding academic achievement in [Subject] during [Term/Year].'),
     ('Short (plaques & digital)', 'For leadership, teamwork, and consistent professionalism.'),
     ('Warm', 'Congratulations on this milestone — you worked hard for it, and it shows.')],
    ['<b>Name</b> — the centerpiece, spelled exactly right.',
     '<b>Award reason</b> — name the specific result, not “a great job”.',
     '<b>Date & organization</b> — who is awarding and when.',
     '<b>Signature + title</b> — an authorized signature line adds weight.'],
    'What to Put on an Award Certificate',
    'Make It Feel Earned',
    ['<b>Numbers beat adjectives</b> — “exceeded target by 120%” lands harder than “outstanding”.',
     '<b>One accent color</b> — a gold or navy border reads formal without clutter.',
     '<b>Proofread the name</b> — a misspelled recipient is the one mistake everyone notices.'],
    [('Is it free?','Yes — the free template is free to use; premium unlocks for a one-time $9.99.'),
     ('Can I edit the wording?','Yes — every field is editable, and you can paste any of the wordings above.'),
     ('Can I print it?','Yes — download a high-res PNG and print at any size.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Award Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),

  build('certificate-generator-online-free.html',
    'Certificate Generator Online — Free, With Built-in Wording',
    'A free online certificate generator that writes the wording for you: pick a type, get copy-paste text, edit in your browser and download. Nothing uploaded.',
    'Certificate Generator Online',
    'Type the details, pick the wording, download a print-ready certificate.',
    'Wording the Generator Can Use',
    [('Completion', 'This certifies that [Name] has successfully completed [Program] on [Date].'),
     ('Achievement', 'Awarded to [Name] in recognition of exceptional effort and achievement in [Program].'),
     ('Participation', 'This certificate is presented to [Name] for participating in [Event] on [Date].'),
     ('Recognition', 'Presented to [Name] for outstanding contribution to [Team/Project] during [Period].'),
     ('Appreciation', 'With sincere gratitude to [Name] for [contribution], [Date].'),
     ('Formal', 'This is to certify that [Name] has successfully completed [Course] with [Hours] hours of study.')],
    ['<b>Header line</b> — “This certifies that” vs “Awarded to” sets the formality.',
     '<b>Recipient</b> — full name, prominent.',
     '<b>Reason</b> — 2–4 sentences max; the certificate is the artifact, not the transcript.',
     '<b>Date + signatory</b> — both anchor authenticity.'],
    'What a Good Certificate Contains',
    'Avoid These Pitfalls',
    ['<b>Vague reasons</b> — “for participation in our program” (which program? when?).',
     '<b>Missing fields</b> — no date, organization or signatory makes it feel fake.',
     '<b>Passive overload</b> — “It is hereby certified that completion has been made” → “This certifies that [Name] completed…”.'],
    [('Is it really free?','Yes — the free template is free; premium is a one-time $9.99 unlock.'),
     ('Do I need to sign up?','No — no account, no email.'),
     ('What can I download?','A print-ready PNG at 1200×850.'),
     ('Is my data uploaded?','No — everything is generated in your browser.')],
    'Generate a Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),

  build('recognition-certificate-template.html',
    'Recognition Certificate Template + Employee Wording',
    'Recognition certificate template with employee wording to copy: team, milestone and years-of-service awards. Edit and print free in your browser.',
    'Recognition Certificate Template',
    'Recognize real work with wording that names exactly what they did.',
    'Copy-Paste Recognition Wording',
    [('Team milestone', 'Presented to [Name] for outstanding contribution to [Team] during [Period].'),
     ('Years of service', 'This certificate recognizes [Name] for [5] years of dedicated service to [Company].'),
     ('Project success', 'In recognition of [Name]\'s leadership and execution in delivering [Project] ahead of schedule.'),
     ('Peer / colleague', 'Awarded to [Name] with appreciation from [Team] for going above and beyond on [Initiative].'),
     ('Formal corporate', 'For exemplary performance and contribution to [Department] in [Year].')],
    ['<b>Employee name</b> — the reason the certificate gets framed.',
     '<b>The specific contribution</b> — project, quarter, result.',
     '<b>Company + logo</b> — makes it feel official.',
     '<b>Date + signature</b> — adds weight.'],
    'What to Put on a Recognition Certificate',
    'Wording Tips',
    ['<b>Say the result, not the effort</b> — “delivered 14 new enterprise clients” beats “hard worker”.',
     '<b>Time periods anchor it</b> — “during Q3” makes it real.',
     '<b>Keep it 2–4 sentences</b> — the certificate is the artifact, the story belongs in the speech.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add a company logo?','Yes — upload your logo in the editor.'),
     ('Can I print it?','Yes — high-res PNG download.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Recognition Certificate Now.',
    'Free to try — no signup, nothing uploaded.'),

  build('participation-certificate-template.html',
    'Participation Certificate Template + Event Wording (Free)',
    'Participation certificate template with ready-to-copy event wording: webinars, workshops, classes. Generate many fast, print and hand out. Free.',
    'Participation Certificate Template',
    'Thank every attendee with a clean certificate you can batch in minutes.',
    'Copy-Paste Participation Wording',
    [('Event', 'This certificate is presented to [Name] for participating in [Event] on [Date].'),
     ('Webinar', 'For attending the [Webinar] webinar on [Date] — thanks for showing up and engaging.'),
     ('Workshop', 'For completing the [Workshop] workshop and joining [Hours] hours of hands-on learning.'),
     ('Warm', 'For showing up, giving your best and being part of what made [Event] special.'),
     ('Short', 'For participating in [Event], [Date].')],
    ['<b>Participant name</b> — the personal touch.',
     '<b>Event + date</b> — what they attended and when.',
     '<b>Your organization</b> — who is certifying.',
     '<b>Keep it clean</b> — a participation certificate should feel generous, not formal.'],
    'What to Include',
    'If You Are Handing Out Many',
    ['<b>Lock the wording once</b> — identical text except the name keeps the batch clean.',
     '<b>Fill names one by one</b> — each takes ~30 seconds in the browser.',
     '<b>Print on card stock</b> — a stack of 30 cards feels like an event.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I make many at once?','Each takes ~30 seconds; generate as many as you need.'),
     ('Can I print them?','Yes — print-ready high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Participation Certificate Now.',
    'Free to try — no signup.'),

  build('graduation-certificate-template.html',
    'Graduation Certificate Template + Formal Wording (Free)',
    'Graduation certificate template with formal wording to copy: courses, bootcamps, summer programs. Edit, print and present. Free in your browser.',
    'Graduation Certificate Template',
    'Wording that turns “you finished” into “you achieved”.',
    'Copy-Paste Graduation Wording',
    [('Course completion', 'This certifies that [Name] has successfully completed the [Program] and is hereby awarded this Certificate of Completion.'),
     ('Bootcamp / intensive', 'For successfully completing [Bootcamp], a [10]-week intensive program, on [Date].'),
     ('Academic', 'Presented to [Name] in recognition of outstanding academic achievement in [Subject] during [Term].'),
     ('Formal', 'This is to certify that [Name] has fulfilled all requirements of [Program] and is entitled to this certificate.'),
     ('Warm', 'Congratulations, [Name] — you showed up, put in the work, and finished.')],
    ['<b>Graduate name</b> — prominent and elegant.',
     '<b>Program name</b> — exactly what they completed.',
     '<b>Date of completion</b> — the milestone.',
     '<b>Instructor / institution</b> — the authority behind it.'],
    'What to Include',
    'Make It Feel Like a Milestone',
    ['<b>Formal phrasing</b> — “This certifies that” beats “Congrats!” for a graduation.',
     '<b>Add duration if true</b> — “a 10-week intensive” adds credibility.',
     '<b>Seal or border</b> — a formal border makes it feel like a diploma.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I edit all the text?','Yes — every field is editable.'),
     ('Can I print it?','Yes — high-res PNG, print at any size.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Graduation Certificate Now.',
    'Free to try — no signup.'),

  build('certificate-of-achievement-template.html',
    'Certificate of Achievement Template + Wording (Free)',
    'Certificate of achievement template with ready-to-copy wording for students, employees and athletes. Edit and print free in your browser.',
    'Certificate of Achievement Template',
    'A template plus the wording that makes an achievement permanent.',
    'Copy-Paste Achievement Wording',
    [('Standard', 'Awarded to [Name] in recognition of exceptional effort and achievement in [Program].'),
     ('Academic', 'For outstanding academic achievement in [Subject] during [Term] at [Institution].'),
     ('Specific result', 'For achieving [grade / rank / result] in [Competition] on [Date].'),
     ('Corporate', 'For exemplary performance in [Role] and contribution to [Department] in [Year].'),
     ('Motivational', 'In recognition of [Name]\'s dedication, perseverance and achievement in [Program].'),
     ('Short', 'For academic achievement and a strong commitment to learning.')],
    ['<b>Name of the achiever</b> — the centerpiece.',
     '<b>The specific achievement</b> — grade, record, result.',
     '<b>Date</b> — anchors the moment.',
     '<b>Signature or seal</b> — makes it feel official.'],
    'What to Put on the Certificate',
    'Wording Tips',
    ['<b>Be specific</b> — “for ranking first in the class” beats “for doing great”.',
     '<b>Match tone to audience</b> — formal for academic/corporate, warm for kids.',
     '<b>Keep it to 2–4 sentences</b> — the certificate is the artifact, not the transcript.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I edit it?','Yes — every field is editable in your browser.'),
     ('Can I print it?','Yes — print-ready high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Achievement Certificate Now.',
    'Free to try — no signup.'),

  build('appreciation-certificate-template.html',
    'Appreciation Certificate Template + Thank-You Wording',
    'Appreciation certificate template with warm thank-you wording: volunteers, staff, mentors, donors. Edit and print free in your browser.',
    'Appreciation Certificate Template',
    'A thank-you that lasts — wording that feels sincere, not corporate.',
    'Copy-Paste Appreciation Wording',
    [('Volunteer', 'With sincere gratitude to [Name] for [Hours] hours of service to [Organization].'),
     ('Staff', 'Presented to [Name] in recognition of [Years] years of dedication to [Company].'),
     ('Mentor', 'Thank you, [Name], for the guidance and generosity you gave [Person/Team].'),
     ('Donor', 'With deep appreciation for [Name]\'s generosity in supporting [Cause].'),
     ('Warm', 'For making a real difference and doing it with grace — thank you.'),
     ('Formal', 'In recognition of [Name]\'s outstanding contribution and dedication.')],
    ['<b>Name</b> — appreciation is personal.',
     '<b>The specific contribution</b> — hours, years, cause.',
     '<b>Your organization</b> — who is saying thanks.',
     '<b>A warm closing</b> — “With sincere gratitude”.'],
    'What to Include',
    'Make It Feel Sincere',
    ['<b>Be specific about the contribution</b> — “120 hours of community service” is real.',
     '<b>Warm beats formal</b> — appreciation certificates should feel grateful, not contractual.',
     '<b>A gold accent</b> — a touch of gold reads as honor, not corporate.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add a message?','Yes — you control all the text.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Appreciation Certificate Now.',
    'Free to try — no signup.'),

  build('blank-certificate-template-printable.html',
    'Blank Certificate Template — Printable, Fillable & Reusable',
    'Blank certificate templates you can print and fill by hand or reuse: awards, events, classrooms. Make one in your browser and print any number. Free.',
    'Blank Certificate Template',
    'A clean printable layout for handwritten names — or a reusable design.',
    'Blank Certificate Wording Ideas',
    [('If filling by hand', 'This certificate is awarded to ______________ for ______________ on ______________.'),
     ('Award', 'Presented to ______________ in recognition of ______________.'),
     ('Classroom', 'This certifies that ______________ has completed ______________.'),
     ('Participation', 'Thank you for being part of ______________ on ______________.'),
     ('Generic', 'In recognition of ______________\'s contribution and dedication.')],
    ['<b>Leave the name blank</b> — for handwritten fills.',
     '<b>Keep a clean layout</b> — a blank design should still look finished.',
     '<b>Add a signature line</b> — usable by any signer.',
     '<b>Print as many as you need</b> — the same design, filled differently every time.'],
    'What a Good Blank Has',
    'How to Use It',
    ['<b>Print a stack before the event</b> — fill names in pen on the spot.',
     '<b>Or type and regenerate</b> — each takes ~30 seconds.',
     '<b>Card stock</b> — a blank you fill by hand still deserves good paper.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I print a blank?','Yes — just leave the name empty and print.'),
     ('Can I fill it by hand?','Yes — or type names and regenerate.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Blank Certificate Now.',
    'Free to try — no signup.'),

  build('course-completion-certificate-template.html',
    'Course Completion Certificate Template + Wording (Free)',
    'Course completion certificate template with wording that adds credibility: hours, level, instructor. For online courses and training. Free.',
    'Course Completion Certificate Template',
    'A certificate that makes your course feel worth finishing.',
    'Copy-Paste Course Completion Wording',
    [('Standard', 'This certifies that [Name] has successfully completed [Course] on [Date].'),
     ('With hours', 'For completing [Course], a [10]-hour program, and passing the final assessment.'),
     ('With level', 'For successfully completing [Course] at the [Intermediate] level.'),
     ('Formal', 'This is to certify that [Name] has fulfilled all requirements of [Course] and is awarded this certificate.'),
     ('Warm', 'Congratulations, [Name] — you finished [Course], and we\'re proud of the work you put in.')],
    ['<b>Student name</b> — the credential they show employers.',
     '<b>Course title</b> — exactly what they completed.',
     '<b>Hours or level</b> — adds credibility.',
     '<b>Instructor + date</b> — authority and timing.'],
    'What to Include for Credibility',
    'Why Certificates Help Courses',
    ['<b>They convert</b> — students finish courses that offer a certificate.',
     '<b>They\'re shareable</b> — a PNG is easy to add to LinkedIn and resumes.',
     '<b>They brand you</b> — a clean certificate makes your course feel more professional than a PDF they could fake.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add my course branding?','Yes — upload your logo and set your colors.'),
     ('Can I batch them?','Each takes ~30 seconds; generate one per student.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Course Completion Certificate Now.',
    'Free to try — no signup.'),

  build('employee-of-the-month-certificate.html',
    'Employee of the Month Certificate + Wording (Free)',
    'Employee of the month certificate template with wording: name the month, the reason, the results. Edit and print free in your browser.',
    'Employee of the Month Certificate',
    'Wording that makes monthly recognition worth framing.',
    'Copy-Paste Employee of the Month Wording',
    [('Standard', 'Presented to [Name] as Employee of the Month for [Month Year].'),
     ('With reason', 'In recognition of [Name]\'s outstanding performance and positive impact during [Month Year].'),
     ('With results', 'Awarded to [Name] for delivering [result] and embodying [value] in [Month Year].'),
     ('Team', 'Voted by [Team] for going above and beyond in [Month Year].'),
     ('Formal', 'For exceptional service, professionalism and dedication to [Company] during [Month Year].')],
    ['<b>Employee name</b> — the centerpiece.',
     '<b>Month and year</b> — makes it a collectible.',
     '<b>The reason</b> — result, value, or team vote.',
     '<b>Company + signature</b> — official and personal.'],
    'What to Include',
    'Make It a Real Program',
    ['<b>Name the month</b> — a dated certificate becomes a series people collect.',
     '<b>Say why</b> — “for delivering X” makes it meaningful, not token.',
     '<b>Print and frame it</b> — a certificate on the wall is visible recognition every day.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add a company logo?','Yes — upload it in the editor.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make an Employee of the Month Certificate Now.',
    'Free to try — no signup.'),

  build('teacher-appreciation-certificate.html',
    'Teacher Appreciation Certificate + Wording (Free)',
    'Teacher appreciation certificate with warm wording for students, classes and school boards. Edit and print free in your browser.',
    'Teacher Appreciation Certificate',
    'A thank-you a teacher will keep for years.',
    'Copy-Paste Teacher Appreciation Wording',
    [('From a student', 'Thank you, [Teacher], for making [Subject] the best part of my day.'),
     ('From a class', 'Presented with gratitude by the [Grade/Class] to [Teacher] for inspiring a love of learning.'),
     ('From the school', 'In recognition of [Teacher]\'s outstanding dedication to teaching at [School].'),
     ('Warm', 'For every extra hour, every patient explanation and every student who felt seen — thank you.'),
     ('Formal', 'For exceptional commitment to student growth and education during [School Year].')],
    ['<b>Teacher name</b> — the reason this is special.',
     '<b>Why</b> — “for inspiring a love of learning”.',
     '<b>From whom</b> — a student, a class, or the school.',
     '<b>Date</b> — the year of the thank-you.'],
    'What to Include',
    'Make It Memorable',
    ['<b>A student\'s words hit hardest</b> — one specific sentence beats a generic line.',
     '<b>Add the class year</b> — teachers keep these for decades.',
     '<b>Warm and simple</b> — a heartfelt certificate needs no corporate polish.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I edit the message?','Yes — all text is editable.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Teacher Appreciation Certificate Now.',
    'Free to try — no signup.'),

  build('sports-award-certificate.html',
    'Sports Award Certificate Template + Wording (Free)',
    'Sports award certificate template with ready-to-copy MVP, champion and sportsmanship wording. For teams and leagues. Free in your browser.',
    'Sports Award Certificate',
    'MVP, champion, most improved — wording for every role on the team.',
    'Copy-Paste Sports Award Wording',
    [('MVP', 'For being the Most Valuable Player at the [Year] [Tournament]. Your skill, leadership and impact decided every game.'),
     ('Champion', 'Presented to [Name] for leading [Team] to the [Year] [Division] Championship.'),
     ('Most improved', 'For the most dramatic improvement this season — from [benchmark] to [benchmark].'),
     ('Sportsmanship', 'For demonstrating fair play, respect for opponents and grace under pressure at [Event].'),
     ('Participation', 'For showing up, giving your best and being a great teammate at [Event], [Date].')],
    ['<b>Player name</b> — the award belongs to them.',
     '<b>The specific award</b> — MVP, champion, most improved.',
     '<b>Team + season</b> — anchors it in time.',
     '<b>Coach signature</b> — personal and authentic.'],
    'What to Include',
    'If You Are the Coach',
    ['<b>One certificate per player</b> — MVP, most improved and participation cover a whole team.',
     '<b>Name the season</b> — “2026 Fall League” makes it a collectible.',
     '<b>Sign each one</b> — a coach\'s signature means more than a logo.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add a team logo?','Yes — upload it.'),
     ('Can I print many?','Yes — one per player, seconds each.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Sports Award Certificate Now.',
    'Free to try — no signup.'),

  build('training-certificate-template.html',
    'Training Certificate Template + Wording (Free)',
    'Training certificate template with wording for workshops and seminars: hours, level, trainer. Edit and print free in your browser.',
    'Training Certificate Template',
    'A certificate that proves attendance and adds credibility to your training.',
    'Copy-Paste Training Wording',
    [('Standard', 'This certifies that [Name] completed the [Training] on [Date].'),
     ('With hours', 'For completing [Training], a [6]-hour program, and passing the assessment.'),
     ('Workshop', 'For joining [Hours] hours of hands-on learning in the [Workshop] workshop.'),
     ('Formal', 'This is to certify that [Name] has fulfilled the requirements of [Training] and is awarded this certificate.'),
     ('Short', 'For successful completion of [Training], [Date].')],
    ['<b>Participant name</b> — their credential.',
     '<b>Training title</b> — “Data Privacy Workshop”.',
     '<b>Duration or hours</b> — adds credibility.',
     '<b>Trainer + date</b> — who and when.'],
    'What to Include',
    'For Trainers & HR',
    ['<b>Hours and level make it resume-worthy</b> — a credential people can actually show.',
     '<b>Batch them</b> — one template, one name change, ~30 seconds each.',
     '<b>Your branding</b> — a logo turns a generic PDF into a branded credential.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I add my company logo?','Yes — upload it.'),
     ('Can I batch them?','Each takes ~30 seconds.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Training Certificate Now.',
    'Free to try — no signup.'),

  build('volunteer-certificate-template.html',
    'Volunteer Certificate Template + Wording (Free)',
    'Volunteer certificate template with wording that documents service: hours, organization, impact. Edit and print free in your browser.',
    'Volunteer Certificate',
    'A certificate that makes volunteer hours a documented, shareable record.',
    'Copy-Paste Volunteer Wording',
    [('Standard', 'With sincere gratitude to [Name] for [120] hours of volunteer service to [Organization].'),
     ('Impact', 'In recognition of [Name]\'s contribution to [Project], which reached [result].'),
     ('Organization', 'Presented by [Organization] in appreciation of [Name]\'s dedicated service in [Year].'),
     ('Warm', 'For showing up again and again and making [Organization] better every time.'),
     ('Formal', 'For outstanding volunteer service and commitment to [Cause] during [Period].')],
    ['<b>Volunteer name</b> — personal recognition.',
     '<b>The service</b> — hours, project, impact.',
     '<b>The organization</b> — who is grateful.',
     '<b>Date + signature</b> — official and warm.'],
    'What to Include',
    'Why It Matters',
    ['<b>Volunteers use these on resumes</b> — hours and organization make it a real record.',
     '<b>Name the impact</b> — “reached 300 families” beats “helped out”.',
     '<b>Warm design</b> — gratitude should look like gratitude, not a contract.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I list hours?','Yes — include them in the text.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Volunteer Certificate Now.',
    'Free to try — no signup.'),

  build('student-of-the-month-certificate.html',
    'Student of the Month Certificate + Wording (Free)',
    'Student of the month certificate template with wording for teachers: name the month, the behavior, the class. Edit and print free.',
    'Student of the Month Certificate',
    'Wording that rewards effort and behavior — not just grades.',
    'Copy-Paste Student of the Month Wording',
    [('Standard', 'Presented to [Name] as Student of the Month for [Month Year].'),
     ('Behavior', 'For kindness, effort and a positive attitude in [Class] during [Month].'),
     ('Effort', 'For consistent hard work and improvement in [Subject] during [Month].'),
     ('Classroom', 'Awarded by [Teacher]\'s class to [Name] for being a great classmate and leader.'),
     ('Warm', 'For showing up with a great attitude every single day this month.')],
    ['<b>Student name</b> — the star.',
     '<b>Month + reason</b> — behavior, effort or achievement.',
     '<b>Class or grade</b> — context.',
     '<b>Teacher signature</b> — personal.'],
    'What to Include',
    'Make It Motivate',
    ['<b>Reward behavior, not just grades</b> — kindness and effort motivate more students.',
     '<b>Name the month</b> — a dated series becomes a goal students aim for.',
     '<b>Send it home</b> — parents are the real audience for the certificate\'s impact.'],
    [('Is it free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Can I edit it?','Yes — every field is editable.'),
     ('Can I print it?','Yes — high-res PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Make a Student of the Month Certificate Now.',
    'Free to try — no signup.'),

  build('printable-certificate-templates.html',
    'Printable Certificate Templates — Full Library + Wording',
    'Free printable certificate templates: completion, award, recognition and more, each with ready-to-copy wording. Edit in your browser, print on card stock.',
    'Printable Certificate Templates',
    'A full library — every template with its wording, ready to edit and print.',
    'Wording for the Most Common Templates',
    [('Completion', 'This certifies that [Name] has successfully completed [Program] on [Date].'),
     ('Award', 'Presented to [Name] in recognition of [achievement], [Date].'),
     ('Recognition', 'For outstanding contribution to [Team] during [Period].'),
     ('Appreciation', 'With sincere gratitude to [Name] for [contribution].'),
     ('Participation', 'For participating in [Event] on [Date].'),
     ('Achievement', 'Awarded to [Name] in recognition of exceptional effort and achievement in [Program].')],
    ['<b>Header line</b> — “This certifies that” (formal) vs “Presented to” (award).',
     '<b>Recipient</b> — full name, prominent.',
     '<b>Reason</b> — 2–4 sentences, specific.',
     '<b>Date + signatory</b> — authenticity.'],
    'What Every Certificate Needs',
    'Print Like a Pro',
    ['<b>Card stock (250gsm+)</b> — feels premium.',
     '<b>Borderless printing</b> if the design is full-bleed.',
     '<b>Check the PNG preview</b> — it shows exactly what prints.',
     '<b>Keep a digital copy</b> — the PNG is also great for email and LinkedIn.'],
    [('Are these templates free?','Yes — the free template is free; premium unlocks all for a one-time $9.99.'),
     ('Can I edit them?','Yes — every field and color is editable.'),
     ('What format do I get?','A print-ready PNG.'),
     ('Is anything uploaded?','No — everything runs in your browser.')],
    'Browse the Templates Now.',
    'Free to try — no signup, nothing uploaded.'),

  build('how-to-make-a-certificate-online.html',
    'How to Make a Certificate Online — Wording + 4-Step Guide',
    'How to make a certificate online free: pick a template, write the wording, add the details, print. Ready-to-copy phrasing included. Nothing uploaded.',
    'How to Make a Certificate Online',
    'The wording, the steps and the details — everything to make one now.',
    'Wording You Can Start From',
    [('Completion', 'This certifies that [Name] has successfully completed [Program] on [Date].'),
     ('Award', 'Presented to [Name] in recognition of [achievement], [Date].'),
     ('Recognition', 'For outstanding contribution to [Team] during [Period].'),
     ('Appreciation', 'With sincere gratitude to [Name] for [contribution].'),
     ('Participation', 'For participating in [Event] on [Date].')],
    ['<b>Recipient name</b> — the one thing everyone checks.',
     '<b>The reason</b> — specific, 2–4 sentences.',
     '<b>Date + organization</b> — who and when.',
     '<b>Signature</b> — adds weight.'],
    'What You Need to Fill In',
    'The 4 Steps',
    ['<b>1. Pick a template</b> — completion, award, recognition, participation and more.',
     '<b>2. Paste the wording</b> — use one of the examples above, fill in the blanks.',
     '<b>3. Add name, date, organization</b> — and a logo if you have one.',
     '<b>4. Download and print</b> — a high-res PNG, on card stock for the real thing.'],
    [('Is making certificates free?','Yes — the free template is free; premium unlocks for a one-time $9.99.'),
     ('Do I need design software?','No — everything runs in your browser.'),
     ('Can I print it?','Yes — download a high-res PNG.'),
     ('Is my data uploaded?','No — everything is generated locally.')],
    'Make a Certificate Now.',
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
        html = html.replace('{base}', BASE)
        with open(os.path.join(OUT, p['slug']), 'w', encoding='utf-8') as f:
            f.write(html)
        print('wrote', p['slug'], len(html), 'bytes')
    print('done —', len(PAGES), 'pages')

if __name__ == '__main__':
    main()
