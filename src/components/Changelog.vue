<template>
  <div class="changelog-container">
    <div class="mb-4 text-sm text-gray-600">
      Dieses Projekt verwendet verschiedene Open-Source-Bibliotheken.
      Details zu den verwendeten Bibliotheken und deren Lizenzen finden Sie in der CREDITS.md Datei im Repository.
    </div>
    
    <div v-for="(version, index) in versions" :key="index" class="mb-6">
      <h3 class="text-lg font-semibold">{{ version.version }} - {{ version.date }}</h3>
      
      <div v-if="version.added && version.added.length" class="mt-2">
        <h4 class="font-medium text-green-700">Added</h4>
        <ul class="list-disc ml-5">
          <li v-for="(item, i) in version.added" :key="i" class="text-sm">{{ item }}</li>
        </ul>
      </div>
      
      <div v-if="version.fixed && version.fixed.length" class="mt-2">
        <h4 class="font-medium text-blue-700">Fixed</h4>
        <ul class="list-disc ml-5">
          <li v-for="(item, i) in version.fixed" :key="i" class="text-sm">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const versions = [
  {
    version: "0.2.0",
    date: "2025-08-05",
    added: [
      "Ground Risk Buffer (GRB) und Contingency Volume (CV) Berechnung nach LBA-Richtlinien",
      "Eingabefelder für Drohnengeschwindigkeit (v0 in km/h), charakteristische Dimension und Flughöhe",
      "Anzeige der berechneten Werte für horizontale und vertikale Abstände",
      "Visualisierung von GRB und CV als Pufferzonen um Felder",
      "Löschen-Button zum Entfernen der Puffervisualisierungen",
      "Referenz zu LBA-Richtlinien mit verwendeten Annahmen",
      "Fortschrittsanzeige für DIPUL-Feature-Prüfung",
      "Implementierung mit Unterstützung von Amazon Q AI"
    ],
    fixed: [ ]
  },
  {
    version: "0.1.0",
    date: "2025",
    added: [
      "Erste Version mit grundlegender Kartenfunktionalität",
      "Unterstützung für KML- und SHP-Dateiimport",
      "DIPUL-Layer-Integration",
      "Feldoptimierungswerkzeuge"
    ]
  }
];
</script>

<style scoped>
.changelog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>