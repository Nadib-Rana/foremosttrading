export interface SvgStructureObject {
  id: string; // elementId (e.g. text_1, layer_2, image_1)
  svgLayerId?: string;
  name: string;
  type: 'FILL' | 'STROKE' | 'TEXT' | 'IMAGE' | 'GROUP';
  parentGroupId?: string;
  textValue?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  placeholder?: string;
  maxChars?: number;
  minChars?: number;
  href?: string;
  width?: string;
  height?: string;
  allowedFormats?: string[];
  maxSizeBytes?: number;
  isEditable?: boolean;
  isLocked?: boolean;
  isHidden?: boolean;
  color?: string;
}
