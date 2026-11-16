export interface PromocodeDto {
    code: string;
    discount: number;
    excludeDiscounted?: boolean;
    expiresAt?: string;
}