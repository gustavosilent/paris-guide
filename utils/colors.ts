// Maps categories to aesthetic gradients/colors - Smart Color System
export const categoryColors: Record<string, { gradient: string, color: string, badge: string }> = {
    FOOD: {
        gradient: 'from-[#FFD600] via-[#FACC15] to-[#EAB308]', // Chrome Yellow
        color: '#FFD600',
        badge: 'bg-[#FFD600]/10 text-[#FFD600] border-[#FFD600]/20'
    },
    TRANSPORTATION: {
        gradient: 'from-[#00F0FF] via-[#0ea5e9] to-[#0284c7]', // Electric Cyan
        color: '#00F0FF',
        badge: 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20'
    },
    CULTURE: {
        gradient: 'from-[#6366F1] via-[#4f46e5] to-[#3730a3]', // Deep Indigo
        color: '#6366F1',
        badge: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20'
    },
    SAFETY: {
        gradient: 'from-[#FF3131] via-[#dc2626] to-[#991b1b]', // Emergency Red
        color: '#FF3131',
        badge: 'bg-[#FF3131]/10 text-[#FF3131] border-[#FF3131]/20'
    },
    CITY: {
        gradient: 'from-[#00FF66] via-[#10b981] to-[#059669]', // Signal Green
        color: '#00FF66',
        badge: 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/20'
    },
    DEFAULT: {
        gradient: 'from-[#FFFFFF] via-[#A3A3A3] to-[#525252]',
        color: '#FFFFFF',
        badge: 'bg-white/5 text-white/70 border-white/10'
    }
}

export const getCategoryColor = (category: string) => {
    return categoryColors[category?.toUpperCase()] || categoryColors.DEFAULT
}
