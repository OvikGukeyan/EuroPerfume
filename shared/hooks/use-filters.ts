import { useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import { useMemo, useState } from "react";

interface PriceProps {
    priceFrom?: number;
    priceTo?: number;
}

export interface QueryFilters extends PriceProps {
    concentration: string;
    gender: string;
    brands: string;
    types: string;
    notes: string;
    page: string
}

export interface Filters {
    gender: Set<string>;
    concentration: Set<string>;
    brands: Set<string>;
    types: Set<string>;
    notes: Set<string>;
    prices: PriceProps
    currentPage: number
}

interface ReturnProps extends Filters {
    setPrices: (name: keyof PriceProps, value: number) => void;
    setSelectedGender: (key: string) => void;
    setSelectedConcentration: (key: string) => void;
    setSelectedBrands: (key: string) => void;
    setSelectedTypes: (key: string) => void;
    setSelectedNotes: (key: string) => void;
    setCurrentPage: (page: number) => void
}

export const useFilters = (): ReturnProps => {
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

    const [brands, { toggle: toggleBrands }] = useSet(new Set<string>(searchParams.get('brands')?.split(',')));

    const [gender, { toggle: toggleGender }] = useSet(new Set<string>(searchParams.get('gender')?.split(',')));

    const [concentration, { toggle: toggleConcentration }] = useSet(new Set<string>(searchParams.get('concentration')?.split(',')));


    const [types, { toggle: toggleTypes }] = useSet(new Set<string>(searchParams.get('types')?.split(',')));

    const [notes, { toggle: toggleNotes }] = useSet(new Set<string>(searchParams.get('notes')?.split(',')));

    const [currentPage, setCurrentPage] = useState( Number(searchParams.get('page')) || 1);


    const [prices, setPrices] = useState<PriceProps>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined
    });

    const updatePrice = (name: keyof PriceProps, value: number) => {
        setPrices(prev => ({ ...prev, [name]: value }));
      }

    return useMemo(() => ({
        gender,
        concentration,
        brands,
        types,
        notes,
        prices,
        currentPage,
        setCurrentPage,
        setSelectedGender: toggleGender,
        setSelectedConcentration: toggleConcentration,
        setSelectedBrands: toggleBrands,
        setSelectedTypes: toggleTypes,
        setSelectedNotes: toggleNotes,
        setPrices: updatePrice,
    }), [
        gender,
        concentration,
        brands,
        types,
        notes,
        prices,
        currentPage
       
    ]);

    };