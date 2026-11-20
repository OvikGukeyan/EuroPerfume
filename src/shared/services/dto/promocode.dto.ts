export interface PromocodeDto {
    valid: boolean;
    code: string;
    discount: number;
    discountCents: number;
    eligibleCents: number;
    excludedCents: number;
    expiresAt?: string;
}
