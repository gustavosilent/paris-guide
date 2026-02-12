// Maps categories to aesthetic gradients/colors
export const categoryColors: Record<string, { gradient: string, glow: string, badge: string }> = {
    FOOD: {
        gradient: 'from-[#FF4D00] via-[#FF8A00] to-[#FFD600]', // High-contrast orange/gold
        glow: 'shadow-[#FF4D00]/20',
        badge: 'bg-[#FF4D00]/10 text-[#FF4D00] border-[#FF4D00]/20'
    },
    TRANSPORTATION: {
        gradient: 'from-[#00E5FF] via-[#00A3FF] to-[#0057FF]', // Technical blues
        glow: 'shadow-[#00A3FF]/20',
        badge: 'bg-[#00A3FF]/10 text-[#00A3FF] border-[#00A3FF]/20'
    },
    CULTURE: {
        gradient: 'from-[#EAB308] via-[#CA8A04] to-[#854D0E]', // Luxury Gold (Replaced Purple)
        glow: 'shadow-[#EAB308]/20',
        badge: 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20'
    },
    SAFETY: {
        gradient: 'from-[#FF0000] via-[#BA0000] to-[#7A0000]', // Deep Signal Red
        glow: 'shadow-[#FF0000]/20',
        badge: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20'
    },
    CITY: {
        gradient: 'from-[#00FF66] via-[#00CA4E] to-[#008A35]', // Signal Green
        glow: 'shadow-[#00FF66]/20',
        badge: 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/20'
    },
    DEFAULT: {
        gradient: 'from-[#FFFFFF] via-[#A3A3A3] to-[#525252]',
        glow: 'shadow-white/5',
        badge: 'bg-white/5 text-white/70 border-white/10'
    }
}

export const getCategoryColor = (category: string) => {
    return categoryColors[category.toUpperCase()] || categoryColors.default
}
