import { supabase } from '@/lib/supabase';
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';

/**
 * Service para gerenciar usuários usando Supabase
 */
export class UserService {
  /**
   * Cria um novo usuário na tabela 'users' do Supabase
   */
  async createUser(data: CreateUserType) {
    // Insere um novo usuário na tabela 'users'
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name: data.name, email: data.email, phone: data.phone }])
      .select()
      .single();
    if (error) {
      if (error.code === '23505') {
        // Código de erro para duplicidade de email
        throw new Error('Email already exists');
      }
      throw new Error('Erro ao criar usuário: ' + error.message);
    }
    return user;
  }

  /**
   * Busca todos os usuários da tabela 'users'
   */
  async getUsers() {
    // Seleciona todos os usuários, ordenando por data de criação
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error('Erro ao buscar usuários: ' + error.message);
    return users;
  }

  /**
   * Busca um usuário específico por ID
   */
  async getUserById(id: string) {
    // Busca usuário pelo campo 'id'
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !user) throw new Error('Usuário não encontrado');
    return user;
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(id: string, data: UpdateUserType) {
    // Atualiza os campos do usuário pelo 'id'
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error('Erro ao atualizar usuário: ' + error.message);
    return user;
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string) {
    // Remove usuário pelo 'id'
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw new Error('Erro ao deletar usuário: ' + error.message);
    return { message: 'User deleted successfully' };
  }
}
