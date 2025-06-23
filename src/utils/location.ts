// /src/utils/location.ts
import { supabase } from './supabase/server';

export const getDailyLocation = async (date: string) => {
  const { data, error } = await supabase
    .from('daily_locations')
    .select('country, city')
    .eq('date', date)
    .single();

  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }

  return data;
};