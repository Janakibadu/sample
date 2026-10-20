# SPEAK — Bildschirm-Mockups

Klickbare Visual-Design-Mockups in Originalgröße zur Überprüfung von Thema und
Look vor der Implementierung — nicht responsiv, und nichts wird tatsächlich
abgeschickt oder validiert, aber jeder Button und jeder Navigationslink führt
zum echten nächsten Bildschirm, wie ein Figma-Prototyp. Öffne `01-home.html`
in einem beliebigen Browser, um zu starten.

Spiegelt das Zwei-Rollen-Modell wider (Lehrkraft, Schüler:in — kein
Administrator; siehe `../Documentation/ADDENDUM_01_roles.md`) sowie das
Screen Inventory im Design-Dokument, Abschnitt 11.

## Gestaltungssprache

- **Lehrkraft-Bildschirme**: klare Seitenleisten-App-Hülle, ruhigere Palette,
  datenreiche Tabellen und Karten — vertrauenswürdig, nicht kindlich.
- **Schüler:innen-Bildschirme**: große abgerundete Kacheln und Buttons,
  helle Farbverläufe, Emoji-„Sticker" zur Dekoration, minimaler Text, alles
  gepaart mit einem 🔊 gesprochenen Anweisungshinweis — kein Lesen
  erforderlich (R39, NFR16).
- Gemeinsame Tokens befinden sich in `theme.css` (Farben, Buttons, Karten,
  die Seitenleisten-Hülle, die Formen der Schüler:innen-Kacheln/Mikrofon-Buttons).
  Palette dort einmal austauschen, sobald eine Markenrichtung feststeht; keine
  Seite muss einzeln geändert werden.

## Dateien

Nummeriert entsprechend der Reihenfolge der Durchsicht: öffentliche
Bildschirme (01–04), Lehrkraft-Bildschirme (05–09), Schüler:innen-Ablauf
(10–11, 17) und eine repräsentative Auswahl von Aufgabentyp-Bildschirmen
(12–16) — die echte Engine rendert ~9 Aufgabentypen aus derselben
Datenstruktur, daher zeigen diese fünf die Bandbreite an Looks, die
unterstützt werden muss, statt jeden einzelnen Typ.
