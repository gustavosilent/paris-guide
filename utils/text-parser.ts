import type { KeywordHighlight } from '~/types'

export type TextSegment = {
    type: 'html' | 'text' | 'highlight' | 'bold' | 'italic'
    content: string
    info?: string
}

/**
 * Parses a description string into segments based on priority:
 * 1. Highlights (highest priority)
 * 2. Bold (**text**) - Monuments/Landmarks
 * 3. Italic ('text') - Foreign words
 * 4. Regular text
 */
export const parseDescription = (text: string, highlights: KeywordHighlight[]): TextSegment[] => {
    if (!text) return []
    if (!highlights.length && !text.includes('**') && !text.includes("'")) {
        return [{ type: 'html', content: text }]
    }

    // Helper to escape regex special characters
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Create a regex for all delimiters including keywords
    // We want to match: **...**, '...', or any keyword
    // Prioritize keywords in the regex OR logic if possible, OR process them recursively.

    // Strategy: 
    // 1. Find all "tokens" of interest with their positions.
    //    Tokens: **Block**, 'Block', Keyword.
    //    This is hard because they overlap.
    //    Example: **Visit 'Paris'** or 'Le **Louvre**'.
    //    Markdown usually doesn't overlap like that, but keywords penetrate everything.

    // Simplified Strategy (Recursive):
    // 1. Find the FIRST occurrence of ANY Highlight Keyword.
    // 2. If found, split string into [Before, Keyword, After].
    // 3. Process 'Before' and 'After' recursively.
    // HOWEVER, this ignores the Bold/Italic context. We lose "Yellow" if we just extract keyword.
    // But rule #1 is "Highlighted tip is top priority". 
    // If "Louvre" is highlighted, it renders as Highlight (Purple/Underline). It does NOT render as Bold Yellow.
    // The user said: "if a word is a highlighted tip, its top priority".
    // So `**Louvre**` -> Render as Highlight (not bold).

    // Issue: What about `**The beautiful Louvre**`? 
    // `The beautiful` should be Bold. `Louvre` Highlight.

    // So proper strategy:
    // 1. Parse Markdown wrappers first (Bold / Italic).
    // 2. Map resulting segments.
    // 3. For each segment (Bold, Italic, Text), search for Keywords inside.
    // 4. If keyword found inside Bold: Split into [Bold(Part1), Highlight(Keyword), Bold(Part2)].

    // Step 1: Split by Formatting
    // Note: Regex split captures delimiters if in ().
    const formatPattern = /(\*\*.*?\*\*|'.*?')/g
    const rawParts = text.split(formatPattern)

    let initialSegments: TextSegment[] = []

    rawParts.forEach(part => {
        if (!part) return

        if (part.startsWith('**') && part.endsWith('**')) {
            initialSegments.push({ type: 'bold', content: part.slice(2, -2) })
        } else if (part.startsWith("'") && part.endsWith("'")) {
            initialSegments.push({ type: 'italic', content: part.slice(1, -1) })
        } else {
            initialSegments.push({ type: 'html', content: part })
        }
    })

    // Step 2: Inject Highlights into Segments
    if (!highlights.length) return initialSegments

    // We need to flatten the array after splitting segments
    const finalSegments: TextSegment[] = []

    const keywordRegex = new RegExp(`(${highlights.map(h => escapeRegExp(h.keyword)).join('|')})`, 'g')

    initialSegments.forEach(segment => {
        // If it's already a complex type, we still need to check for keywords inside
        // because Rule 1 says Keyword > formatting.

        const subParts = segment.content.split(keywordRegex)

        // If no keywords found, push original segment
        if (subParts.length === 1 && subParts[0] === segment.content) {
            finalSegments.push(segment)
            return
        }

        // If keywords found, we process the split
        subParts.forEach(subPart => {
            if (!subPart) return

            // Check if this part is a keyword
            const highlight = highlights.find(h => h.keyword === subPart)
            if (highlight) {
                // It is a keyword -> Force type to Highlight (overrides bold/italic)
                finalSegments.push({ type: 'highlight', content: subPart, info: highlight.info })
            } else {
                // It is not a keyword -> Keep original container type (Bold, Italic, or HTML)
                finalSegments.push({ type: segment.type, content: subPart })
            }
        })
    })

    return finalSegments
}
