# Agrar Drohnenkarte

Die Applikation erlaubt es KML, SHP und ähnliche Dateien einzulesen.
Die Polygone / Felder Werden auf der Karte mit Dipul-Overlay angezeigt.

Dies ist ein Vue 3 + Vite + Tailwind CSS Projekt, das einen interaktiven Kartenviewer mit DIPUL WMS-Layern bietet.  
Alle Layer können ein- und ausgeschaltet werden, der Basemap-Switcher wechselt zwischen OSM und Satellitenkarte.  
GetFeatureInfo liefert Details beim Klick auf die Karte.

## Features

- Anzeige von DIPUL-WMS-Layern (alle Layer kombinierbar, ein Request pro Kachel)
- Basemap-Wechsel (OpenStreetMap/Satellit)
- Responsive 3-Spalten-Layout mit Tailwind CSS
- GetFeatureInfo (Objektinfos per Kartenklick, JSON-Ausgabe)
- Docker-Deployment für Produktion
