export enum UserRole {
  // ADMIN = "ADMIN",
  AGENT = "AGENT",
  TENANT = "TENANT",
}

export enum DocumentVerificationStages {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  // SOLD = "SOLD",
  // RENTED = "RENTED",
  UNAVAILABLE = "UNAVAILABLE",
}
export enum PropertyListingTypes {
  SALE = "SALE",
  RENT = "RENT",
  SHORT_LET = "SHORT-LET",
  LEASE = "LEASE",
}
export enum MediaTypes {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
export enum InquiryStages {
  PENDING = "PENDING",
  RESPONDED = "RESPONDED",
  CLOSED = "CLOSED",
}
export enum NigerianStates {
  ABIA = "Abia",
  ADAMAWA = "Adamawa",
  AKWA_IBOM = "Akwa Ibom",
  ANAMBRA = "Anambra",
  BAUCHI = "Bauchi",
  BAYELSA = "Bayelsa",
  BENUE = "Benue",
  BORNO = "Borno",
  CROSS_RIVER = "Cross River",
  DELTA = "Delta",
  EBONYI = "Ebonyi",
  EDO = "Edo",
  EKITI = "Ekiti",
  ENUGU = "Enugu",
  GOMBE = "Gombe",
  IMO = "Imo",
  JIGAWA = "Jigawa",
  KADUNA = "Kaduna",
  KANO = "Kano",
  KATSINA = "Katsina",
  KEBBI = "Kebbi",
  KOGI = "Kogi",
  KWARA = "Kwara",
  LAGOS = "Lagos",
  NASARAWA = "Nasarawa",
  NIGER = "Niger",
  OGUN = "Ogun",
  ONDO = "Ondo",
  OSUN = "Osun",
  OYO = "Oyo",
  PLATEAU = "Plateau",
  RIVERS = "Rivers",
  SOKOTO = "Sokoto",
  TARABA = "Taraba",
  YOBE = "Yobe",
  ZAMFARA = "Zamfara",
  FCT = "Federal Capital Territory",
}
export enum PropertyType {
  FLAT = "Flat",
  HOUSE = "House",
  LAND = "Land",
  COMMERCIAL_PROPERTY = "Commercial property",
}

export enum PropertySubType {
  APARTMENT = "Apartment",
  STUDIO = "Studio",
  BLOCK_OF_FLAT = "Block of Flat",
  TERRACED_DUPLEX = "Terraced Duplex",
  SEMI_DETACHED_DUPLEX = "Semi-Detached Duplex",
  FULLY_DETACHED_DUPLEX = "Fully Detached Duplex",
  FULLY_DETACHED_BUNGALOW = "Fully Detached Bungalow",
  SEMI_DETACHED_BUNGALOW = "Semi-Detached Bungalow",
}

export const PropertyTypeToSubtypes: Record<PropertyType, PropertySubType[]> = {
  [PropertyType.FLAT]: [
    PropertySubType.APARTMENT,
    PropertySubType.STUDIO,
    PropertySubType.BLOCK_OF_FLAT,
  ],
  [PropertyType.HOUSE]: [
    PropertySubType.TERRACED_DUPLEX,
    PropertySubType.SEMI_DETACHED_DUPLEX,
    PropertySubType.FULLY_DETACHED_DUPLEX,
    PropertySubType.FULLY_DETACHED_BUNGALOW,
    PropertySubType.SEMI_DETACHED_BUNGALOW,
  ],
  [PropertyType.LAND]: [],
  [PropertyType.COMMERCIAL_PROPERTY]: [],
};
// export const baseMediaUrl = "http://localhost:5000/media"
export const baseMediaUrl =
  "https://property-manager-backend-63ug.onrender.com/media";
