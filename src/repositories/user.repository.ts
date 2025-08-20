// Repositório responsável por acessar o banco de dados para entidades de usuário
// Aqui ficam apenas as operações diretas com o Prisma
import { supabase } from '../lib/supabase';
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';

/**
 * Repositório de usuário usando Supabase
 */
export class UserRepository {
  /** Cria um novo usuário */
  async create(data: CreateUserType) {
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at
      }])
      .select('id, name, email, phone, role, department, status, created_at, updated_at')
      .single();
    if (error) {
      if (error.message.includes('users_email_key')) {
        throw new Error('E-mail já existente no sistema');
      }
      throw new Error('Erro ao criar usuário: ' + error.message);
    }
    return user;
  }

  /** Busca todos os usuários */
  async findAll() {
    console.log('🔗 Executando consulta findAll no Supabase...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, department, last_login, status, created_at, updated_at')
      .order('created_at', { ascending: false });
      
    console.log('📊 Resultado da consulta:');
    console.log('- Error:', error);
    console.log('- Data:', users);
    console.log('- Data length:', users?.length);
    
    if (error) throw new Error('Erro ao buscar usuários: ' + error.message);
    return users;
  }

  /** Busca usuário por ID */
  async findById(id: string) {
    console.log('🔗 Executando consulta findById no Supabase para ID:', id);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, department, last_login, status, created_at, updated_at')
      .eq('id', id)
      .single();
      
    console.log('📊 Resultado da consulta findById:');
    console.log('- Error:', error);
    console.log('- Data:', user);
    
    if (error || !user) throw new Error('Usuário não encontrado');
    return user;
  }

  /** Atualiza usuário */
  async update(id: string, data: UpdateUserType) {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      })
      .eq('id', id)
      .select('id, name, email, phone, role, department, last_login, status, created_at, updated_at')
      .single();
    if (error) throw new Error('Erro ao atualizar usuário: ' + error.message);
    return user;
  }

  /** Deleta usuário */
  async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw new Error('Erro ao deletar usuário: ' + error.message);
    return { message: 'User deleted successfully' };
  }
}
