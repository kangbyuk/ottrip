// /src/types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      schedules: {
        Row: {
          id: number;
          title: string;
          start_time: string;
          end_time: string;
          description: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          title: string;
          start_time: string;
          end_time: string;
          description?: string | null;
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['schedules']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
  };
}