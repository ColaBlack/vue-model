/**
 * 模型相关常量
 */

/**
 * 文本模型列表
 */
export const TEXT_MODELS = ['glm-z1-flash', 'glm-4.5-flash', 'glm-4-flash'] as const

/**
 * 视觉模型列表
 */
export const VISION_MODELS = ['vision', 'vision_reasoning'] as const

/**
 * 模型显示名称映射
 */
export const MODEL_NAMES: Record<string, string> = {
  'glm-z1-flash': 'GLM-Z1-Flash（深度推理）',
  'glm-4.5-flash': 'GLM-4.5-Flash（标准）',
  'glm-4-flash': 'GLM-4-Flash（普通）',
  'vision': 'GLM-4V-Flash（快速识别）',
  'vision_reasoning': 'GLM-4.1V-Thinking-Flash（深度思考）'
}

/**
 * 默认模型
 */
export const DEFAULT_MODEL = 'glm-4.5-flash'

