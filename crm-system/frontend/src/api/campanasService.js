import { supabase } from './supabaseClient';

export const campanasService = {
  // Obtener todas las campañas
  async getCampanas() {
    const { data, error } = await supabase
      .from('campañas')
      .select('*')
      .order('fecha_inicio', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Crear nueva campaña
  async createCampana(campanaData) {
    const { data, error } = await supabase
      .from('campañas')
      .insert([campanaData])
      .select();
      
    if (error) throw error;
    return data;
  },

  // Actualizar campaña existente
  async updateCampana(id, campanaData) {
    const { data, error } = await supabase
      .from('campañas')
      .update(campanaData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data;
  },

  // Eliminar campaña
  async deleteCampana(id) {
    const { error } = await supabase
      .from('campañas')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
