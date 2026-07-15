export type CustomizerTab = "designs" | "colors" | "elements" | "text" | "players";

export interface KitColors {
  jerseyBody: string;
  pantBody: string;
  collar: string;
  socks: string;
  borders: string;
}

export type DesignPattern = "classic" | "striped" | "sash" | "gradients" | "modern";

export interface KitDesign {
  pattern: DesignPattern;
  primaryColor: string;
  secondaryColor: string;
}

export interface PlayerText {
  name: string;
  number: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

export interface ElementDecal {
  id: string;
  type: "logo" | "sponsor" | "badge";
  url: string;
  x: number;
  y: number;
  scale: number;
}

export interface TeamPlayer {
  id: string;
  number: string;
  name: string;
  size: string;
}
