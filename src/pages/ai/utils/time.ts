/**
 * 时间格式化工具
 * 提供各种时间格式化功能
 */

/**
 * 格式化时间戳为 HH:MM 格式
 * 
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的时间字符串，如 "14:30"
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 格式化时间戳为完整日期时间格式
 * 
 * @param timestamp - 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串，如 "2024-01-01 14:30:00"
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间戳为相对时间（如"刚刚"、"5分钟前"）
 * 
 * @param timestamp - 时间戳（毫秒）
 * @returns 相对时间描述
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return formatDateTime(timestamp)
  }
}

