export interface Attribute {
    attributeId:number;
    attributeName:string;
    attributeType:string;
    hasDefaultAttributes:boolean;
    defaultAttributes: {
        defaultAttributeId: number;
        attributeId: number;
        attributeValue: string;
    }[];
    
}
