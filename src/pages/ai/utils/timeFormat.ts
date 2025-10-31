/**
 * 时间格式化工具函数集合
 * 
 * 提供各种时间格式化功能，包括：
 * - 相对时间（如"5分钟前"）
 * - 标准日期格式
 * - 时间戳转换
 */

/**
 * 将时间转换为相对时间格式
 * 
 * 根据时间差异，返回不同的相对时间描述：
 * - 小于1分钟：显示"刚刚"
 * - 小于1小时：显示"X分钟前"
 * - 小于1天：显示"X小时前"
 * - 小于7天：显示"X天前"
 * - 超过7天：显示具体日期（如"03-15"或"2024-03-15"）
 * 
 * @param timeStr 时间字符串（支持任何 Date 构造函数可解析的格式）
 * @returns 格式化后的相对时间文本
 * 
 * @example
 * formatRelativeTime('2024-01-01T10:00:00Z') // 返回 "5分钟前"
 * formatRelativeTime('2023-12-25T00:00:00Z') // 返回 "12-25"
 */
export function formatRelativeTime(timeStr: string | undefined): string {
  // 处理空值情况
  if (!timeStr) {
    return ''
  }

  // 将时间字符串转换为 Date 对象
  const date = new Date(timeStr)
  const now = new Date()
  
  // 计算时间差（毫秒）
  const diff = now.getTime() - date.getTime()

  // 时间常量（毫秒）
  const MINUTE = 60 * 1000
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const WEEK = 7 * DAY

  // 小于1分钟
  if (diff < MINUTE) {
    return '刚刚'
  }

  // 小于1小时
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return `${minutes}分钟前`
  }

  // 小于1天
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `${hours}小时前`
  }

  // 小于7天
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY)
    return `${days}天前`
  }

  // 超过7天，显示具体日期
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  // 如果是今年，省略年份
  if (year === now.getFullYear()) {
    return `${month}-${day}`
  }

  // 否则显示完整日期
  return `${year}-${month}-${day}`
}

/**
 * 将时间转换为标准日期格式（YYYY-MM-DD）
 * 
 * @param timeStr 时间字符串
 * @returns 格式化后的日期字符串
 * 
 * @example
 * formatDate('2024-01-01T10:30:00Z') // 返回 "2024-01-01"
 */
export function formatDate(timeStr: string | undefined): string {
  if (!timeStr) {
    return ''
  }

  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 将时间转换为标准时间格式（HH:MM:SS）
 * 
 * @param timeStr 时间字符串
 * @returns 格式化后的时间字符串
 * 
 * @example
 * formatTime('2024-01-01T10:30:45Z') // 返回 "10:30:45"
 */
export function formatTime(timeStr: string | undefined): string {
  if (!timeStr) {
    return ''
  }

  const date = new Date(timeStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

/**
 * 将时间转换为完整的日期时间格式（YYYY-MM-DD HH:MM:SS）
 * 
 * @param timeStr 时间字符串
 * @returns 格式化后的完整日期时间字符串
 * 
 * @example
 * formatDateTime('2024-01-01T10:30:45Z') // 返回 "2024-01-01 10:30:45"
 */
export function formatDateTime(timeStr: string | undefined): string {
  if (!timeStr) {
    return ''
  }

  return `${formatDate(timeStr)} ${formatTime(timeStr)}`
}

