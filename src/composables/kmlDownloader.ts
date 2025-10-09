import { Feature } from 'ol';
import type Polygon from 'ol/geom/Polygon';
import type MultiPolygon from 'ol/geom/MultiPolygon';
import { FieldLayerList } from './customerMaps';
import { fieldPrefix } from './shpDownloader';
import KML from 'ol/format/KML';
import { getCenter } from 'ol/extent';
import Point from 'ol/geom/Point';

function getAllFieldsWithBuffers(): Array<{
  field: Feature<Polygon | MultiPolygon>;
  fieldName: string;
  contingencyVolume?: Polygon | MultiPolygon;
  groundRiskBuffer?: Polygon | MultiPolygon;
}> {
  const fieldsWithBuffers: Array<{
    field: Feature<Polygon | MultiPolygon>;
    fieldName: string;
    contingencyVolume?: Polygon | MultiPolygon;
    groundRiskBuffer?: Polygon | MultiPolygon;
  }> = [];

  if (FieldLayerList) {
    FieldLayerList.forEach(layerItem => {
      layerItem.featureList.forEach(featureItem => {
        const fieldName = getFieldName(featureItem.feature);
        
        fieldsWithBuffers.push({
          field: featureItem.feature as Feature<Polygon | MultiPolygon>,
          fieldName: fieldName,
          contingencyVolume: featureItem.contingency_volume,
          groundRiskBuffer: featureItem.ground_risk_buffer
        });
      });
    });
  }

  return fieldsWithBuffers;
}

function getFieldName(feature: Feature): string {
  const props = feature.getProperties();
  return (
    props.name ||
    props.NAME ||
    props.Name ||
    props.FLUR ||
    props.BEZEICHNUNG ||
    'Unnamed Field'
  ).toString();
}

function replaceUmlaute(str: string): string {
  return str
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss');
}

export async function downloadFieldsWithBuffersAsKML() {
  const fieldsWithBuffers = getAllFieldsWithBuffers();
  
  if (!fieldsWithBuffers.length) {
    alert('Keine Felder geladen!');
    return;
  }

  // Check if any fields have calculated buffers
  const hasBuffers = fieldsWithBuffers.some(item => 
    item.contingencyVolume || item.groundRiskBuffer
  );

  if (!hasBuffers) {
    alert('Keine GRB/CV Berechnungen gefunden! Bitte zuerst die Puffer berechnen.');
    return;
  }
  
  // Create features for KML export
  const allFeatures: Feature[] = [];

  let prefix = fieldPrefix.value ?? 'felder';
  if (prefix.length === 0) prefix = 'felder';
  if (prefix.length > 15) prefix = prefix.substring(0, 14);

  fieldsWithBuffers.forEach((item) => {
    const fieldPrefix = prefix === 'felder' ? '' : prefix + '_';
    const baseName = replaceUmlaute(fieldPrefix + item.fieldName);
    
    // Add original field
    const fieldFeature = item.field.clone();
    fieldFeature.set('name', `${baseName}_Field`);
    fieldFeature.set('description', `Original field: ${item.fieldName}`);
    fieldFeature.set('styleUrl', '#fieldStyle');
    allFeatures.push(fieldFeature);

    // Add label for field
    const fieldCenter = getCenter(item.field.getGeometry()!.getExtent());
    const fieldLabelFeature = new Feature({
      geometry: new Point(fieldCenter),
      name: `${baseName}_Field`,
      description: `Field Label: ${item.fieldName}`,
      styleUrl: '#fieldLabelStyle'
    });
    allFeatures.push(fieldLabelFeature);

    // Add contingency volume if exists
    if (item.contingencyVolume) {
      const cvFeature = new Feature({
        geometry: item.contingencyVolume,
        name: `${baseName}_CV`,
        description: `Contingency Volume for field: ${item.fieldName}`,
        styleUrl: '#cvStyle'
      });
      allFeatures.push(cvFeature);

      // Add label for CV with slight offset
      const cvCenter = getCenter(item.contingencyVolume.getExtent());
      cvCenter[0] += 0.0005; // Small offset to avoid overlap
      cvCenter[1] += 0.0005;
      const cvLabelFeature = new Feature({
        geometry: new Point(cvCenter),
        name: `${baseName}_CV`,
        description: `CV Label: ${item.fieldName}`,
        styleUrl: '#cvLabelStyle'
      });
      allFeatures.push(cvLabelFeature);
    }

    // Add ground risk buffer if exists
    if (item.groundRiskBuffer) {
      const grbFeature = new Feature({
        geometry: item.groundRiskBuffer,
        name: `${baseName}_GRB`,
        description: `Ground Risk Buffer for field: ${item.fieldName}`,
        styleUrl: '#grbStyle'
      });
      allFeatures.push(grbFeature);

      // Add label for GRB with different offset
      const grbCenter = getCenter(item.groundRiskBuffer.getExtent());
      grbCenter[0] -= 0.0005; // Different offset to avoid overlap
      grbCenter[1] -= 0.0005;
      const grbLabelFeature = new Feature({
        geometry: new Point(grbCenter),
        name: `${baseName}_GRB`,
        description: `GRB Label: ${item.fieldName}`,
        styleUrl: '#grbLabelStyle'
      });
      allFeatures.push(grbLabelFeature);
    }
  });

  // Use OpenLayers KML format to convert features
  const kmlFormat = new KML();
  let kmlString = kmlFormat.writeFeatures(allFeatures, {
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326'
  });

  // Add styles to the KML string
  const styledKML = addStylesToKML(kmlString, prefix);

  // Create and download the file
  const blob = new Blob([styledKML], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agrarkarte_${prefix}_GRB-CV.kml`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function addStylesToKML(kmlString: string, prefix: string): string {
  // Define styles
  const styles = `
    <!-- Field Style -->
    <Style id="fieldStyle">
      <LineStyle>
        <color>ffeb6325</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>33eb6325</color>
        <outline>1</outline>
      </PolyStyle>
      <LabelStyle>
        <color>ffb29108</color>
        <scale>1.1</scale>
      </LabelStyle>
    </Style>
    
    <!-- Contingency Volume Style -->
    <Style id="cvStyle">
      <LineStyle>
        <color>cc00a5ff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>1a00a5ff</color>
        <outline>1</outline>
      </PolyStyle>
      <LabelStyle>
        <color>ff00a5ff</color>
        <scale>0.9</scale>
      </LabelStyle>
    </Style>
    
    <!-- Ground Risk Buffer Style -->
    <Style id="grbStyle">
      <LineStyle>
        <color>cc0000ff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>1a0000ff</color>
        <outline>1</outline>
      </PolyStyle>
      <LabelStyle>
        <color>ff0000ff</color>
        <scale>0.8</scale>
      </LabelStyle>
    </Style>
    
    <!-- Label Styles for Points -->
    <Style id="fieldLabelStyle">
      <IconStyle>
        <Icon>
          <href></href>
        </Icon>
        <scale>0</scale>
      </IconStyle>
      <LabelStyle>
        <color>ffb29108</color>
        <scale>1.1</scale>
      </LabelStyle>
    </Style>
    
    <Style id="cvLabelStyle">
      <IconStyle>
        <Icon>
          <href></href>
        </Icon>
        <scale>0</scale>
      </IconStyle>
      <LabelStyle>
        <color>ff00a5ff</color>
        <scale>0.9</scale>
      </LabelStyle>
    </Style>
    
    <Style id="grbLabelStyle">
      <IconStyle>
        <Icon>
          <href></href>
        </Icon>
        <scale>0</scale>
      </IconStyle>
      <LabelStyle>
        <color>ff0000ff</color>
        <scale>0.8</scale>
      </LabelStyle>
    </Style>`;

  // Add document name and description
  const documentHeader = `<name>Agrarkarte ${prefix} with GRB/CV</name>
    <description>Agricultural fields with Ground Risk Buffer and Contingency Volume calculations</description>`;

  // Insert styles and document info into the KML
  let styledKML = kmlString.replace(
    /<Document>/,
    `<Document>\n    ${documentHeader}\n    ${styles}`
  );

  // Add styleUrl references to placemarks - more precise regex
  // Handle polygon placemarks
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_Field)<\/name>\s*<description>Original field/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#fieldStyle</styleUrl>\n      <description>Original field'
  );
  
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_CV)<\/name>\s*<description>Contingency Volume/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#cvStyle</styleUrl>\n      <description>Contingency Volume'
  );
  
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_GRB)<\/name>\s*<description>Ground Risk Buffer/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#grbStyle</styleUrl>\n      <description>Ground Risk Buffer'
  );

  // Handle label placemarks (points)
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_Field)<\/name>\s*<description>Field Label/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#fieldLabelStyle</styleUrl>\n      <description>Field Label'
  );
  
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_CV)<\/name>\s*<description>CV Label/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#cvLabelStyle</styleUrl>\n      <description>CV Label'
  );
  
  styledKML = styledKML.replace(
    /<Placemark>\s*<name>([^<]*_GRB)<\/name>\s*<description>GRB Label/g,
    '<Placemark>\n      <name>$1</name>\n      <styleUrl>#grbLabelStyle</styleUrl>\n      <description>GRB Label'
  );

  return styledKML;
}

