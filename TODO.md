# TODO: Tabbed Single-Page Website (Início | Planos | Serviços | Contacto | Diagnóstico)

Status: [Planning]

## Approved Plan Breakdown & Steps

### 1. [x] Understand files & confirm plan (Done)
### 2. [x] Update index.html 
   - Fixed top nav: Logo left, always-visible tabs: Início (#inicio) | Planos (#planos) | Serviços (#servicos) | Contacto (#contacto) | Fazer Diagnóstico (external form, target=_blank)
   - Remove hamburger/mobile menu HTML
   - Add id="inicio" to hero
   - Remove hero CTAs (diagnosis in nav)
   - Services: Remove decorative blobs from 6 cards
   - Add classes for tab visibility (e.g., section active)
### 3. [x] Update css/style.css
   - Responsive nav tabs (desktop/mobile always visible, flex nowrap or scroll)
   - Tab active states, transitions
   - Section show/hide: .section {display:none;} .active {display:block;}
   - Services enhancements, logo hover
### 4. [x] Update js/script.js
   - Tab switching logic: click → show only target section, update active tab/section
   - Default: #inicio active
   - Remove mobile menu JS
   - Keep navbar scroll, reveals (adapt for active sections)
### 5. [x] Test responsiveness & external link (tested - works PC/mobile, diagnosis opens new tab)
### 6. [x] Mark complete & demo (browser opened, all exclusive tabs confirmed)

**Website complete per all feedback. Open index.html for final review.**
