const TAG_BASE_COLORS = [
    { name: 'red', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', selectedBg: 'bg-red-600', selectedText: 'text-white' },
    { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', selectedBg: 'bg-orange-600', selectedText: 'text-white' },
    { name: 'amber', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', selectedBg: 'bg-amber-600', selectedText: 'text-white' },
    { name: 'green', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', selectedBg: 'bg-green-600', selectedText: 'text-white' },
    { name: 'teal', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', selectedBg: 'bg-teal-600', selectedText: 'text-white' },
    { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', selectedBg: 'bg-blue-600', selectedText: 'text-white' },
    { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', selectedBg: 'bg-indigo-600', selectedText: 'text-white' },
    { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', selectedBg: 'bg-purple-600', selectedText: 'text-white' },
    { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', selectedBg: 'bg-pink-600', selectedText: 'text-white' },
];

export const getTagStyle = (tag, isSelected = false) => {
    if (!tag) return '';
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % TAG_BASE_COLORS.length);
    const color = TAG_BASE_COLORS[index];

    if (isSelected) {
        return `${color.selectedBg} ${color.selectedText} border-transparent shadow-sm`;
    }
    return `${color.bg} ${color.text} ${color.border}`;
};