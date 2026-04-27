import { supabase } from './supabaseClient';

export const reportesService = {
  async getClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getOportunidades() {
    const { data, error } = await supabase
      .from('oportunidades')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getCampanas() {
    const { data, error } = await supabase
      .from('campañas')
      .select('*');
    if (error) throw error;
    return data || [];
  }
};
