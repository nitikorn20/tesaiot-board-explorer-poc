// Mirrors the selected Pot → RGB example: strictly above 50%, not analog dimming.
export function thresholdRGB(values){return values.map(value=>Number(value)>50?1:0);}
