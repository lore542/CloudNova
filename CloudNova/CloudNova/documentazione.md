# Documentazione del Sito Web CloudNova

## Panoramica
Questo documento fornisce una panoramica del sito web CloudNova, un provider di servizi cloud con intelligenza artificiale integrata. Il sito è stato sviluppato utilizzando HTML, CSS, JavaScript e Bootstrap per creare un'esperienza utente responsive e interattiva.

## Struttura del Sito
Il sito è composto dalle seguenti pagine principali:

1. **Home (index.html)**
   - Presentazione dell'azienda
   - Sezioni informative sui servizi e punti di forza
   - Sezione contatti

2. **Offerte (offerte.html)**
   - Elenco delle tariffe disponibili
   - Dettagli su cosa è incluso in ogni piano
   - Filtri per tipologia di servizio
   - Sistema di aggiunta al carrello

3. **Consulente (consulente.html)**
   - Opzioni di consulenza (dal vivo o online)
   - Vantaggi di ciascuna modalità
   - Form di prenotazione consulenza
   - Testimonianze clienti

4. **Checkout (checkout.html)**
   - Riepilogo carrello
   - Form per dati di fatturazione
   - Opzioni di pagamento
   - Conferma ordine

## Funzionalità Principali

### Navigazione
- Menu responsive che si adatta a diverse dimensioni di schermo
- Logo cliccabile che riporta alla home page
- Breadcrumb per navigazione secondaria
- Menu mobile per dispositivi piccoli

### Smooth Scrolling
- Transizioni fluide tra le sezioni della pagina
- Pulsante "Torna su" con scorrimento fluido
- Animazioni al caricamento degli elementi

### Sistema Multilingua
- Supporto per italiano, inglese e tedesco
- Selettore di lingua nel menu principale
- Persistenza della selezione lingua tramite localStorage

### Carrello e Checkout
- Aggiunta prodotti al carrello
- Visualizzazione in tempo reale del contenuto del carrello
- Modifica quantità e rimozione prodotti
- Calcolo automatico di subtotale, IVA e totale
- Processo di checkout completo

### Sistema di Prenotazione Consulenze
- Selezione tipo di consulenza (dal vivo o online)
- Form di prenotazione con validazione
- Conferma prenotazione

## Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura delle pagine
- **CSS3**: Stile e layout
- **JavaScript**: Interattività e funzionalità dinamiche
- **Bootstrap 5**: Framework CSS per design responsive

### Librerie JavaScript
- **Bootstrap JS**: Per componenti interattivi (modal, dropdown, ecc.)
- **Font Awesome**: Per icone

### Archiviazione Dati
- **localStorage**: Per persistenza del carrello e preferenze utente

## Struttura dei File

```
cloudnova-site/
├── index.html              # Home page
├── offerte.html            # Pagina offerte
├── consulente.html         # Pagina consulente
├── checkout.html           # Pagina checkout
├── css/
│   └── style.css           # Stili personalizzati
├── js/
│   ├── main.js             # Funzionalità generali
│   ├── smooth-scroll.js    # Funzionalità di smooth scrolling
│   ├── cart.js             # Gestione del carrello
│   ├── checkout.js         # Gestione del checkout
│   └── consultation.js     # Gestione prenotazione consulenze
└── img/                    # Directory per le immagini
```

## Responsive Design
Il sito è completamente responsive e si adatta a diverse dimensioni di schermo:
- **Desktop**: Layout completo con tutte le funzionalità
- **Tablet**: Layout adattato con menu comprimibile
- **Mobile**: Layout ottimizzato per schermi piccoli con menu hamburger

## Istruzioni per l'Uso

### Navigazione
- Clicca sul logo in alto a sinistra per tornare alla home page
- Utilizza il menu di navigazione per accedere alle diverse sezioni
- Usa il selettore di lingua per cambiare la lingua del sito

### Acquisto Servizi
1. Naviga alla pagina "Offerte"
2. Sfoglia i servizi disponibili o usa i filtri per trovare quello desiderato
3. Clicca su "Aggiungi al Carrello" per i servizi che desideri acquistare
4. Clicca sull'icona del carrello per visualizzare il contenuto
5. Clicca su "Procedi al Checkout" per completare l'acquisto
6. Compila il form con i tuoi dati e scegli il metodo di pagamento
7. Clicca su "Conferma Ordine" per finalizzare l'acquisto

### Prenotazione Consulenza
1. Naviga alla pagina "Consulente"
2. Scegli tra consulenza dal vivo o online
3. Compila il form di prenotazione con i tuoi dati
4. Seleziona data e ora preferite
5. Invia la richiesta di prenotazione

## Note di Implementazione
- Il sito utilizza localStorage per memorizzare il carrello e le preferenze di lingua
- Tutte le funzionalità sono implementate lato client per questa demo
- In un ambiente di produzione, sarebbe necessario implementare un backend per gestire ordini, prenotazioni e autenticazione utenti

## Requisiti di Browser
Il sito è compatibile con le versioni recenti dei seguenti browser:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge
- Opera

## Contatti per Supporto
Per assistenza tecnica o domande sul sito, contattare:
- Email: support@cloudnova.it
- Telefono: +39 06 1234567
