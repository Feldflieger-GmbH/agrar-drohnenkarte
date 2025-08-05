# Agrar Drohnenkarte

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
- Ground Risk Buffer (GRB) und Contingency Volume (CV) Berechnung nach LBA-Richtlinien

## Credits

Dieses Projekt verwendet verschiedene Open-Source-Bibliotheken. Details zu den verwendeten Bibliotheken und deren Lizenzen finden Sie in der [CREDITS.md](CREDITS.md) Datei.

## Changelog

Eine vollständige Liste der Änderungen finden Sie in der [CHANGELOG.md](CHANGELOG.md) Datei.
