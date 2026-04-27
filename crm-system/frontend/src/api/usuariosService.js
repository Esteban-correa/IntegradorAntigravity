import { supabase } from './supabaseClient';

export const usuariosService = {
  // Obtener todos los usuarios, con JOIN a 'roles'
  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, roles(nombre)');
    
    if (error) throw error;
    return data;
  },

  // Crear nuevo usuario
  async createUsuario(usuarioData) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuarioData])
      .select();
      
    if (error) throw error;
    return data;
  },

  // Actualizar usuario existente (incluyendo estado)
  async updateUsuario(id, usuarioData) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuarioData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data;
  },

  // Eliminar usuario
  async deleteUsuario(id) {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};
