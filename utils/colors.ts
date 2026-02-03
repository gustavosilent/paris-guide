// Maps categories to aesthetic gradients/colors
export const categoryColors: Record<string, { gradient: string, glow: string, badge: string }> = {
    FOOD: {
        gradient: 'from-orange-400 via-rose-500 to-amber-500', // Warm, appetizing
        glow: 'shadow-orange-500/30',
        badge: 'bg-orange-500/20 text-orange-200 border-orange-500/20'
    },
    TRANSPORTATION: {
        gradient: 'from-blue-400 via-cyan-400 to-indigo-500', // Cool, efficient
        glow: 'shadow-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-200 border-blue-500/20'
    },
    CULTURE: {
        gradient: 'from-purple-400 via-fuchsia-500 to-pink-500', // Artistic, royal
        glow: 'shadow-purple-500/30',
        badge: 'bg-purple-500/20 text-purple-200 border-purple-500/20'
    },
    SAFETY: {
        gradient: 'from-red-400 via-rose-500 to-pink-600', // Alert but stylish
        glow: 'shadow-red-500/30',
        badge: 'bg-red-500/20 text-red-200 border-red-500/20'
    },
    CITY: {
        gradient: 'from-emerald-400 via-teal-500 to-cyan-500', // Urban, parks
        glow: 'shadow-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/20'
    },
    DEFAULT: {
        gradient: 'from-gray-200 via-gray-100 to-white',
        glow: 'shadow-white/10',
        badge: 'bg-white/10 text-white/80 border-white/10'
    }
}

export const getCategoryColor = (category: string) => {
    return categoryColors[category.toUpperCase()] || categoryColors.default
}
