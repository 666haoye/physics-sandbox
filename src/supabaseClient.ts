import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // 配置缺失时尽早失败，避免业务调用时才发现问题
  throw new Error('Supabase 配置缺失：请检查根目录 .env.local 中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

/**
 * 全局唯一的 Supabase 客户端（ESM 模块单例，各处直接 import 使用）。
 * anon key 属于可公开的前端密钥，数据安全依赖 Supabase 端的 RLS 行级安全策略。
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

/** 当前登录用户，未登录或请求失败时返回 null */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('获取当前用户失败:', error.message)
    return null
  }
  return data.user
}

/** 单条实验记录，字段以项目实际表结构为准（experiment_records 表） */
export interface ExperimentRecord {
  id: string
  user_id: string
  /** 实验标识，如 "free-fall"、"pendulum" */
  experiment_key: string
  /** 实验测量数据（JSONB） */
  data: Record<string, unknown>
  created_at: string
}

/** 保存一条实验记录，需先登录；失败时返回 null */
export async function saveExperimentRecord(
  experimentKey: string,
  data: Record<string, unknown>,
): Promise<ExperimentRecord | null> {
  const user = await getCurrentUser()
  if (!user) {
    console.warn('用户未登录，实验记录未保存')
    return null
  }

  const { data: record, error } = await supabase
    .from('experiment_records')
    .insert({ user_id: user.id, experiment_key: experimentKey, data })
    .select()
    .single()

  if (error) {
    console.error('保存实验记录失败:', error.message)
    return null
  }
  return record as ExperimentRecord
}

/** 读取当前用户的实验记录，可按实验标识过滤，按创建时间倒序 */
export async function listExperimentRecords(experimentKey?: string): Promise<ExperimentRecord[]> {
  let query = supabase
    .from('experiment_records')
    .select('*')
    .order('created_at', { ascending: false })

  if (experimentKey) {
    query = query.eq('experiment_key', experimentKey)
  }

  const { data, error } = await query
  if (error) {
    console.error('读取实验记录失败:', error.message)
    return []
  }
  return (data ?? []) as ExperimentRecord[]
}
