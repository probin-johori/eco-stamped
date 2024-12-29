// src/lib/hooks/useBrands.ts
import { useQuery } from '@tanstack/react-query';
import { getBrands } from '@/lib/brands';
import type { SustainableBrand } from '@/lib/brands';

export function useBrands(p0?: { staleTime: number; suspense: boolean; }) {
  return useQuery<SustainableBrand[], Error>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
}
