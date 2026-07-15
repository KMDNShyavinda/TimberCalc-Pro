/**
 * Smart Mixed-Unit Input Parser
 *
 * Parses free-text measurement strings like:
 *   "5ft 8in"   -> { feet: 5, inches: 8 }
 *   "3m 45cm"   -> { meters: 3, centimeters: 45 }
 *   "20in"      -> { inches: 20 }
 *   "12'6\""    -> { feet: 12, inches: 6 }
 *
 * This is a first-pass client-side parser for instant UI feedback.
 * The authoritative calculation should still be verified/recomputed
 * on the backend (Laravel) before saving to history.
 */

const UNIT_PATTERNS = [
  { key: 'feet', regex: /(\d+(?:\.\d+)?)\s*(?:ft|feet|')/i },
  { key: 'inches', regex: /(\d+(?:\.\d+)?)\s*(?:in|inch|inches|")/i },
  { key: 'meters', regex: /(\d+(?:\.\d+)?)\s*(?:m|meter|meters|metre|metres)(?!m)/i },
  { key: 'centimeters', regex: /(\d+(?:\.\d+)?)\s*(?:cm|centimeter|centimeters)/i },
  { key: 'millimeters', regex: /(\d+(?:\.\d+)?)\s*(?:mm|millimeter|millimeters)/i },
]

export function parseMixedUnit(input) {
  if (!input || typeof input !== 'string') return {}

  const result = {}
  let remaining = input.trim()

  for (const { key, regex } of UNIT_PATTERNS) {
    const match = remaining.match(regex)
    if (match) {
      result[key] = parseFloat(match[1])
    }
  }

  return result
}

// Converts a parsed mixed-unit object to a single base unit (centimeters)
export function mixedUnitToCentimeters(parsed) {
  const FEET_TO_CM = 30.48
  const INCH_TO_CM = 2.54
  const M_TO_CM = 100
  const MM_TO_CM = 0.1

  let total = 0
  if (parsed.feet) total += parsed.feet * FEET_TO_CM
  if (parsed.inches) total += parsed.inches * INCH_TO_CM
  if (parsed.meters) total += parsed.meters * M_TO_CM
  if (parsed.centimeters) total += parsed.centimeters
  if (parsed.millimeters) total += parsed.millimeters * MM_TO_CM

  return total
}

export default parseMixedUnit
