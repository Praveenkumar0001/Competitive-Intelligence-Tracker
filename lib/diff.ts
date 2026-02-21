import { diffLines } from 'diff'

export function generateDiff(oldText: string, newText: string): string {
  const diff = diffLines(oldText, newText)
  
  let result = ''
  let changeCount = 0
  
  for (const part of diff) {
    if (part.added) {
      result += `+ ${part.value}\n`
      changeCount++
    } else if (part.removed) {
      result += `- ${part.value}\n`
      changeCount++
    } else {
      // Show some context
      const lines = part.value.split('\n').slice(0, 2)
      result += `  ${lines.join('\n  ')}\n`
    }
  }
  
  return changeCount > 0 ? result : 'No changes detected'
}

export function hasSignificantChanges(diffText: string): boolean {
  // Count additions and removals
  const lines = diffText.split('\n')
  const changes = lines.filter(line => line.startsWith('+') || line.startsWith('-'))
  
  // Consider significant if more than 5 lines changed
  return changes.length > 5
}
