export interface DipulFeatureCollection {
    type: "FeatureCollection";
    features: DipulFeature[];
}

export interface DipulFeature {
    type: "Feature";
    id: string;
    properties: DipulFeatureProperties;
}

export interface DipulFeatureProperties {
    name: string;
    type_code: string;
    lower_limit_unit: string;
    lower_limit_alt_ref: string;
    lower_limit_altitude: string;
    legal_ref: string;
    external_reference: string;
}