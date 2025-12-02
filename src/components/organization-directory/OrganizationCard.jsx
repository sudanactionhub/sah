import react from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Link as LinkIcon, Globe, MapPin, Eye, CheckCircle, Calendar, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { getTagStyle } from '@/utils/tagUtils';
import { cn } from '@/lib/utils';

const OrganizationCard = ({ org }) => {
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        const s = status.toLowerCase();
        if (s.includes('active')) return 'bg-green-100 text-green-800 border-green-200';
        if (s.includes('inactive')) return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    const renderSocialIcon = (url) => {
        if (url.includes('facebook')) return <Facebook className="h-4 w-4" />;
        if (url.includes('twitter') || url.includes('x.com')) return <Twitter className="h-4 w-4" />;
        if (url.includes('instagram')) return <Instagram className="h-4 w-4" />;
        if (url.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
        return <Globe className="h-4 w-4" />;
    };

    const tags = org.tags ? String(org.tags).split(',').map(t => t.trim()).filter(Boolean) : [];

    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-gray-200 bg-white group">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4 h-14">
                        <CardTitle className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {org.name}
                        </CardTitle>
                        {org.status && (
                            <Badge variant="outline" className={`shrink-0 ${getStatusColor(org.status)}`}>
                                {org.status}
                            </Badge>
                        )}
                    </div>
                    
                    <div className="h-6">
                        {org.website && (
                            <a 
                                href={org.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline w-fit truncate max-w-full"
                            >
                                <LinkIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{org.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                            </a>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                    {/* Areas of Operation - Fixed Height approx */}
                    <div className="min-h-[2.5rem]">
                        {org.areas_of_operation && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                                <div className="flex flex-wrap gap-1 line-clamp-2">
                                    {String(org.areas_of_operation).split(',').map((area, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                                            {area.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description - Fixed Height */}
                    <div className="h-[5rem]">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                            {org.description_english}
                        </p>
                    </div>

                    {/* Tags Section - Fixed Height */}
                    <div className="h-[3.5rem] overflow-hidden">
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 5).map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-medium border",
                                            getTagStyle(tag, false)
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {tags.length > 5 && (
                                    <span className="text-xs text-gray-400 self-center">+{tags.length - 5}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        {org.founded_year && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>Founded: {org.founded_year}</span>
                            </div>
                        )}
                        {org.visibility && (
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5 text-gray-400" />
                                <span>{org.visibility.split('(')[0].trim()}</span>
                            </div>
                        )}
                        {org.type && (
                            <div className="col-span-2 flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-gray-400" />
                                <span className="truncate">{org.type}</span>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5 pt-2 h-[3rem]">
                        {org.email && (
                            <a href={`mailto:${org.email}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors w-fit truncate max-w-full">
                                <Mail className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                                <span className="truncate">{org.email}</span>
                            </a>
                        )}
                        {org.phone && (
                            <div className="flex items-center text-sm text-gray-600 truncate">
                                <Phone className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                                <span className="truncate">{org.phone}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer - Social Media */}
                <CardFooter className="pt-0 pb-4 mt-auto">
                    <div className="w-full pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 h-8 overflow-hidden">
                            {org.social_media && org.social_media.split(',').map((url, idx) => {
                                const trimmedUrl = url.trim();
                                if (!trimmedUrl) return null;
                                return (
                                    <a 
                                        key={idx}
                                        href={trimmedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title={trimmedUrl}
                                    >
                                        {renderSocialIcon(trimmedUrl)}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default OrganizationCard;