"""Check the generated static deliverable without launching a browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import sys
root=Path(__file__).resolve().parents[1]/'out'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.h1=0;self.title=False;self.in_title=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag in ['a','link'] and 'href' in a:self.refs.append(a['href'])
  if tag in ['script','img'] and 'src' in a:self.refs.append(a['src'])
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
 def handle_data(self,data):
  if self.in_title and data.strip():self.title=True
pages={}
for p in root.rglob('*.html'):
 if p.name in ['404.html','500.html']:continue
 parser=Page();parser.feed(p.read_text());pages[p.resolve()]=parser
errors=[]
for p,data in pages.items():
 if not data.title:errors.append(f'{p}: missing title')
 if len(data.ids)!=len(set(data.ids)):errors.append(f'{p}: duplicate ids')
 if data.h1!=1:errors.append(f'{p}: {data.h1} H1s')
 for ref in data.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc or ref.startswith('data:'):continue
  target=(root/unquote(u.path).lstrip('/')) if u.path.startswith('/') else (p.parent/unquote(u.path) if u.path else p)
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{p.relative_to(root)}: missing {ref}')
  elif u.fragment and target.resolve() in pages and unquote(u.fragment) not in pages[target.resolve()].ids:errors.append(f'{p.relative_to(root)}: missing anchor {ref}')
required=['index.html','about/index.html','publications/index.html','lab/index.html','adam-kostka-cv.pdf','fonts/instrument-sans.woff2','sitemap.xml','robots.txt']
for path in required:
 if not (root/path).is_file():errors.append(f'Missing required output: {path}')
if errors:print('\n'.join(errors));sys.exit(1)
print(f'Checked {len(pages)} HTML pages: internal links, anchors, assets, unique IDs, titles and heading structure pass.')

# Deployment boundary: prevent accidentally shipping owner-private review metadata.
from xml.etree import ElementTree
origin='https://feilaz.github.io'
for p in pages:
 if '_not-found' in p.parts:continue
 html=p.read_text()
 assert 'chatgpt.site' not in html, f'{p}: private review origin leaked into public output'
 assert '<meta name="robots" content="index, follow"' in html, f'{p}: public page is not indexable'
 assert f'rel="canonical" href="{origin}/' in html, f'{p}: canonical is not on GitHub Pages'
robots=(root/'robots.txt').read_text()
assert 'Allow: /' in robots and 'Disallow: /' not in robots, 'Public robots.txt blocks crawlers'
assert (root/'.nojekyll').is_file(), 'GitHub Pages needs .nojekyll for _next assets'
urls=[e.text for e in ElementTree.parse(root/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==11 and all(u.startswith(origin+'/') for u in urls), 'Sitemap must cover the 11 public routes'
print('GitHub Pages origin, indexing, sitemap and .nojekyll checks pass.')
