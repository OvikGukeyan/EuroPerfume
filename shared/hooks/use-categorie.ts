import { useEffect } from 'react';
import { CategoriesState, useCategoryStore } from '../store';

export const useCategories = (): CategoriesState => {
    
    const categoriesState = useCategoryStore((state) => state);
    
    useEffect(() => {
        categoriesState.fetchCategories()
    }, []);

    return categoriesState;
}