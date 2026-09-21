// GENERATED from the live schema of Supabase project aaknvhlirztdglxsnbho. Do not edit.
// Regenerate: npm run gen:types  (needs `npx supabase login` once)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      checkins: {
        Row: {
          clean: boolean;
          created_at: string | null;
          date: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          clean: boolean;
          created_at?: string | null;
          date: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          clean?: boolean;
          created_at?: string | null;
          date?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'checkins_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cravings: {
        Row: {
          created_at: string | null;
          duration_seconds: number | null;
          id: string;
          outcome: string | null;
          strength: number | null;
          tool_used: string | null;
          trigger: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          duration_seconds?: number | null;
          id?: string;
          outcome?: string | null;
          strength?: number | null;
          tool_used?: string | null;
          trigger?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          duration_seconds?: number | null;
          id?: string;
          outcome?: string | null;
          strength?: number | null;
          tool_used?: string | null;
          trigger?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cravings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      milestones: {
        Row: {
          category: string;
          id: string;
          key: string;
          shared: boolean | null;
          unlocked_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          id?: string;
          key: string;
          shared?: boolean | null;
          unlocked_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          id?: string;
          key?: string;
          shared?: boolean | null;
          unlocked_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'milestones_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          cigarettes_per_day: number | null;
          cigarettes_per_pack: number | null;
          committed: boolean | null;
          created_at: string | null;
          fears: string[] | null;
          gender: string | null;
          id: string;
          is_premium: boolean | null;
          name: string | null;
          onboarding_completed: boolean | null;
          pack_price_rsd: number | null;
          product: string | null;
          push_token: string | null;
          quit_date: string | null;
          quit_time_zone: string | null;
          reason_text: string | null;
          reasons: string[] | null;
          signature_data: string | null;
          timing: string | null;
          triggers: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          cigarettes_per_day?: number | null;
          cigarettes_per_pack?: number | null;
          committed?: boolean | null;
          created_at?: string | null;
          fears?: string[] | null;
          gender?: string | null;
          id: string;
          is_premium?: boolean | null;
          name?: string | null;
          onboarding_completed?: boolean | null;
          pack_price_rsd?: number | null;
          product?: string | null;
          push_token?: string | null;
          quit_date?: string | null;
          quit_time_zone?: string | null;
          reason_text?: string | null;
          reasons?: string[] | null;
          signature_data?: string | null;
          timing?: string | null;
          triggers?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          cigarettes_per_day?: number | null;
          cigarettes_per_pack?: number | null;
          committed?: boolean | null;
          created_at?: string | null;
          fears?: string[] | null;
          gender?: string | null;
          id?: string;
          is_premium?: boolean | null;
          name?: string | null;
          onboarding_completed?: boolean | null;
          pack_price_rsd?: number | null;
          product?: string | null;
          push_token?: string | null;
          quit_date?: string | null;
          quit_time_zone?: string | null;
          reason_text?: string | null;
          reasons?: string[] | null;
          signature_data?: string | null;
          timing?: string | null;
          triggers?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      quiz_submissions: {
        Row: {
          annual_cost_rsd: number | null;
          answers: Json | null;
          cigarettes_per_day: number | null;
          committed: boolean | null;
          created_at: string | null;
          email: string;
          fagerstrom_level: string | null;
          fagerstrom_score: number | null;
          five_year_cost_rsd: number | null;
          gender: string | null;
          id: string;
          name: string | null;
          readiness_score: number | null;
          smoking_profile: string | null;
        };
        Insert: {
          annual_cost_rsd?: number | null;
          answers?: Json | null;
          cigarettes_per_day?: number | null;
          committed?: boolean | null;
          created_at?: string | null;
          email: string;
          fagerstrom_level?: string | null;
          fagerstrom_score?: number | null;
          five_year_cost_rsd?: number | null;
          gender?: string | null;
          id?: string;
          name?: string | null;
          readiness_score?: number | null;
          smoking_profile?: string | null;
        };
        Update: {
          annual_cost_rsd?: number | null;
          answers?: Json | null;
          cigarettes_per_day?: number | null;
          committed?: boolean | null;
          created_at?: string | null;
          email?: string;
          fagerstrom_level?: string | null;
          fagerstrom_score?: number | null;
          five_year_cost_rsd?: number | null;
          gender?: string | null;
          id?: string;
          name?: string | null;
          readiness_score?: number | null;
          smoking_profile?: string | null;
        };
        Relationships: [];
      };
      slips: {
        Row: {
          created_at: string | null;
          id: string;
          notes: string | null;
          trigger: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          trigger?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          trigger?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'slips_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
