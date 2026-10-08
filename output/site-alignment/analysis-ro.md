# Alinierea demo-ului Best Forex Brokers cu noul website FXRebate

Referință analizată: http://141.98.155.230/en
Demo: https://fxrebate-best-brokers-demo.vercel.app/brokers/best-forex-brokers
Data: 8 octombrie 2026. Etapă: analiză; demo-ul public și arhiva de import nu au fost modificate.

## Obiectiv înțeles
Păstrăm pagina de discovery, textele și structura premium a cardurilor Top 6, dar armonizăm fonturile, culorile, butoanele, suprafețele, logo-ul și spațierea cu noul website. Rezultatul trebuie să poată fi integrat vizual de programatori în același produs.

## Ce am verificat
Homepage în browser Chromium, 1440 px desktop și 390 px mobil, pagina Forex Rebates, CSS-urile publice, fonturile încărcate, stilurile calculate, meniul Brokers și comutarea dark/light. Capturile și JSON-urile din acest folder sunt dovezile analizei. HTML/CSS public de referință este în input/new-website-reference/.

## Sistemul vizual observat
- Font principal: Satoshi, self-hosted, disponibil la greutăți 300/400/500/700/900. În conținutul principal au fost încărcate 400/500/700. Alte familii există în bundle-uri, dar nu sunt fontul principal al paginii.
- Corp: 16 px, line-height 24 px, greutate 400. Pagina interioară Forex Rebates folosește H1 de 40 px/700 și acțiuni de 14 px/500. Este reperul mai potrivit pentru colecția noastră decât hero-ul homepage-ului.
- Titlu hero desktop: 64 px, greutate 700, line-height aproximativ 71 px; pe mobil clasele declară 32 px. Este o scară de homepage, nu o obligație pentru pagina de colecție.
- Text/CTA principal: #0C110F; text inversat #F9F9F9.
- Fundal light principal: #FFFFFF; suprafețe neutre: #F6F6F6, #F3F3F3, #EAEAEA.
- Verde din tokenul folosit la hover de navigație: #008138. Verdele și auriul apar în branding și accente/gradiente.
- CTA Join now: text 16 px, greutate 500, fundal aproape negru, colțuri 6 px în header și 10 px în hero; umbră 0 3px 8.1px rgba(0,0,0,.22).
- Navigație desktop pe două niveluri, cu bară gri rotunjită; pe mobil meniul se strânge într-un hamburger.
- Logo-ul light are wordmark aproape negru; dark are wordmark alb. Diferă de varianta albastră din demo.
- Dark mode funcționează: fundal aproape negru, text deschis, CTA principal inversat.
- Pagina este servită de Next.js; CSS-ul public include utilitare Tailwind. Codul-sursă și componentele React nu sunt disponibile prin simpla analiză a URL-ului.

## Diferențe și ajustări recomandate
| Element | Demo actual | Ajustare |
|---|---|---|
| Font | Inter/Arial declarat, fără font Satoshi livrat | Folosim exact Satoshi 400/500/700 din aplicația lor; în demo îl livrăm local pentru reproducere |
| Text/titluri | Albastru petrol #103B49 | Aproape negru #0C110F |
| Fundal | Gri cu tentă verde #F6F8F7 | Alb cu suprafețe gri neutru din site |
| Accente | Verde #087452 | Aliniere cu verdele site-ului #008138; auriu folosit discret |
| CTA | Albastru petrol, 12–13 px | Aproape negru, Satoshi 500, scară mai lizibilă, colțuri/hover în familia site-ului |
| Logo | Varianta albastră veche | Variantele black/light și white/dark folosite pe noul site |
| Cashback | Panou verde foarte deschis | Păstrăm distinctivitatea și poziția, armonizăm verdele și contrastul cu noul sistem |
| Theme | Light only | Componentele trebuie să accepte tema globală light/dark |
| Header/footer | Structură proprie demo | În site-ul final folosim layout-ul global existent, fără dublarea navigației |

## Ce păstrăm
Grila 3/2/1, Rank + Best For, logo-urile normalizate, ratingurile reale disponibile, verdictul, cele trei fapte, panoul FXRebate Cashback, maximum două highlights, CTA View Broker, comparația mobilă și FAQ accesibil. Nu transformăm cardurile în copii ale hero-ului homepage-ului și nu mărim titlul atât încât să împingă Top 6 prea jos. Recomandarea pentru titlul colecției: 40–48 px desktop și 30–32 px mobil, cu greutatea Satoshi 700. Valorile finale se verifică vizual în grila de carduri.

## Integrare propusă
Programatorii pot păstra conținutul/configurația colecției și modelul cardului; adapterul se conectează la broker master. În Next.js, renderer-ele statice din demo se transpun în componente React și se conectează la tokenurile Tailwind/font/theme și layout-ul global. Importul ZIP-ului actual reproduce demo-ul exact, dar nu reprezintă deja un modul Next.js nativ. Nu duplicăm baza de brokeri, headerul, footerul sau providerul de theme.

## Limite
Pagina /brokers accesată din meniul Forex Brokers List a afișat “This page is temporarily unavailable”. Totuși, ruta /en/forex-brokers/forex-rebates?broker_type=broker este funcțională și arată listingul de rebates: Satoshi, carduri cu borduri gri subtile, CTA aproape negru și rate per tip de cont. Acesta confirmă stilul paginilor interioare. /en/brokers întoarce 404. Elementul Best Brokers 2025 din meniu este încă un link #. Routingul final și componentele interne trebuie confirmate de programatori. Observațiile de font/paletă sunt măsurate pe homepage, nu presupuse din logo.

## Routing observat
Profilurile din listing folosesc /en/forex-brokers/forex-rebates/{slug}?broker_type=broker&broker_id={id}&type=new, nu rutele vechi /brokers/{slug}. La integrare, programatorii trebuie să mapeze linkurile Top 6 la masterul și ID-urile noului site. Nu există suficientă evidență pentru a inventa ID-uri pentru cei șase brokeri ai demo-ului.
