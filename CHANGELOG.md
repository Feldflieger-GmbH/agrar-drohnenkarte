# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-08-05

### Added
- KML export functionality for fields with Ground Risk Buffer (GRB) and Contingency Volume (CV) data
- Styled KML output with color-coded polygons matching the application's visual scheme:
  - Field polygons: Blue outline with light blue fill
  - Contingency Volume (CV): Orange outline with semi-transparent fill  
  - Ground Risk Buffer (GRB): Red outline with semi-transparent fill
- Smart label positioning system to prevent text overlap:
  - Field labels: Gold color, largest scale (1.1x)
  - CV labels: Orange color, medium scale (0.9x) with spatial offset
  - GRB labels: Red color, smallest scale (0.8x) with opposite spatial offset
- Unified prefix system - both shapefile and KML exports now use the same field name prefix
- Professional KML structure with proper metadata and descriptions
- Validation to ensure GRB/CV calculations exist before export
- Enhanced download button: "Als KML mit GRB/CV herunterladen" in the export section

### Changed
- Shapefile download button text updated to "Als ShapeFile für DJI herunterladen" for clarity

### Technical
- Created new `kmlDownloader.ts` composable for KML export functionality
- Implemented proper coordinate transformation from EPSG:3857 to EPSG:4326
- Added separate point-based label features with invisible icons
- Enhanced regex-based styling system for KML post-processing

## [0.3.0] - 2025-01-27

### Added
- Help tooltips for major sections in the right sidebar
- Interactive "i" icons that show contextual help on hover/tap
- Improved user guidance for all main features
- Better accessibility with explanatory tooltips
- Separated Export & Optimisation
- Redesign Sidebar
- Introduced Template to remove repeating code
- Show progress for dipul-check based on points to check

## [0.2.0] - 2025-08-05

### Added
- Ground Risk Buffer (GRB) and Contingency Volume (CV) calculation based on LBA guidelines
- Input fields for drone speed (v0 in km/h), characteristic dimension, and flight height
- Display of calculated values for horizontal and vertical distances
- Visualization of GRB and CV as buffer zones around fields
- Delete button to remove buffer visualizations
- Reference to LBA guidelines with assumptions used in calculations
- Progress bar for DIPUL feature checking
- Implementation assisted by Amazon Q AI



## [0.1.0] - 2025

### Added
- Initial release with basic map functionality
- Support for KML and SHP file import
- DIPUL layer integration
- Field optimization tools