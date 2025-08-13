
import { supabase } from '@/lib/supabase';

/**
 * Serviço de database usando Supabase
 * O Supabase client já gerencia a conexão automaticamente.
 */

// Exemplo de função para testar conexão ao banco via Supabase
export async function testDatabaseConnection(): Promise<void> {
  const { error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('❌ Erro ao conectar com o Supabase:', error.message);
    process.exit(1);
  } else {
    console.log('📦 Conexão com Supabase bem-sucedida!');
  }
}
