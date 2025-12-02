import react, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { List, Database, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterControls from '@/components/organization-directory/FilterControls';
import OrganizationCard from '@/components/organization-directory/OrganizationCard';

const OrganizationDirectoryPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [filters, setFilters] = useState({ 'Type': [], 'Areas of Operation': [], 'Status': [], 'Tags': [], 'Visibility': [] });
    const [foundedYearRange, setFoundedYearRange] = useState([1950, new Date().getFullYear()]);
    const [yearFilterBounds, setYearFilterBounds] = useState([1950, new Date().getFullYear()]);
    const [filterOptions, setFilterOptions] = useState({ 'Type': {}, 'Areas of Operation': {}, 'Status': [], 'Tags': [], 'Visibility': [] });

    const { toast } = useToast();

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('organizations').select('*');
                if (error) throw error;
                setOrganizations(data || []);
                generateFilterOptions(data || []);
            } catch (err) {
                setError(err.message);
                toast({ variant: "destructive", title: "Error fetching organizations", description: err.message });
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizations();
    }, [toast]);

    const generateFilterOptions = (data) => {
        if (!data || data.length === 0) return;
        
        const options = { 
            'Type': {}, 
            'Areas of Operation': {}, 
            'Status': new Set(), 
            'Tags': new Set(), 
            'Visibility': new Set() 
        };
        
        let minYear = Infinity, maxYear = -Infinity;

        data.forEach(item => {
            // Process Type (Hierarchy: Main/Sub)
            if (item.type) {
                String(item.type).split(',').forEach(t => {
                    const parts = t.trim().split('/');
                    const main = parts[0].trim();
                    const sub = parts.length > 1 ? parts.slice(1).join('/').trim() : null;
                    
                    if (!options['Type'][main]) options['Type'][main] = [];
                    if (sub && !options['Type'][main].includes(sub)) {
                        options['Type'][main].push(sub);
                    }
                });
            }

            // Process Areas of Operation (Hierarchy: Main/Level2 (Level3))
            if (item.areas_of_operation) {
                String(item.areas_of_operation).split(',').forEach(area => {
                    const parts = area.trim().split('/');
                    const main = parts[0].trim();
                    
                    if (!options['Areas of Operation'][main]) options['Areas of Operation'][main] = {};
                    
                    if (parts[1]) {
                        const level2Full = parts[1].trim();
                        const match = level2Full.match(/(.*?)\s*\((.*)\)/);
                        const level2 = match ? match[1].trim() : level2Full;
                        const level3 = match ? match[2].trim() : null;

                        if (!options['Areas of Operation'][main][level2]) {
                            options['Areas of Operation'][main][level2] = [];
                        }
                        if (level3 && !options['Areas of Operation'][main][level2].includes(level3)) {
                            options['Areas of Operation'][main][level2].push(level3);
                        }
                    }
                });
            }

            // Process Status
            if (item.status) {
                options['Status'].add(item.status.trim());
            }

            // Process Visibility (Extract text outside parens)
            if (item.visibility) {
                const vis = item.visibility.split('(')[0].trim();
                options['Visibility'].add(vis);
            }

            // Process Tags
            if (item.tags) {
                String(item.tags).split(',').map(s => s.trim()).filter(Boolean).forEach(v => options['Tags'].add(v));
            }

            // Process Years
            if (item.founded_year) {
                if (item.founded_year < minYear) minYear = item.founded_year;
                if (item.founded_year > maxYear) maxYear = item.founded_year;
            }
        });

        // Sort and Set Options
        const sortedOptions = {
            'Type': {},
            'Areas of Operation': {},
            'Status': Array.from(options['Status']).sort(),
            'Visibility': Array.from(options['Visibility']).sort(),
            'Tags': Array.from(options['Tags']).sort()
        };

        Object.keys(options['Type']).sort().forEach(key => {
            sortedOptions['Type'][key] = options['Type'][key].sort();
        });

        Object.keys(options['Areas of Operation']).sort().forEach(key => {
            sortedOptions['Areas of Operation'][key] = {};
            Object.keys(options['Areas of Operation'][key]).sort().forEach(subKey => {
                sortedOptions['Areas of Operation'][key][subKey] = options['Areas of Operation'][key][subKey].sort();
            });
        });

        setFilterOptions(sortedOptions);
        
        if (minYear !== Infinity && maxYear !== -Infinity) {
            const currentYear = new Date().getFullYear();
            // Ensure range is valid
            const safeMin = minYear > 0 ? minYear : 1900;
            const safeMax = maxYear > 0 ? maxYear : currentYear;
            setYearFilterBounds([safeMin, safeMax]);
            setFoundedYearRange([safeMin, safeMax]);
        }
    };

    const getChildren = useCallback((key, value) => {
        // Include the parent value itself to ensure top-level matches are included
        let children = [value];
        
        if (!filterOptions[key]) return children;

        if (key === 'Areas of Operation') {
            const path = value.split('/');
            if (path.length === 1) { // Main category -> get all level 2s and 3s
                const main = path[0];
                if (filterOptions[key][main]) {
                    Object.entries(filterOptions[key][main]).forEach(([level2, level3s]) => {
                        const level2Val = `${main}/${level2}`;
                        children.push(level2Val);
                        level3s.forEach(l3 => children.push(`${level2Val} (${l3})`));
                    });
                }
            } else if (path.length === 2) { // Level 2 -> get all level 3s
                const [main, level2] = path;
                if (filterOptions[key][main]?.[level2]) {
                    filterOptions[key][main][level2].forEach(l3 => {
                        children.push(`${value} (${l3})`);
                    });
                }
            }
        } else if (key === 'Type') {
            // Value is MainType, get all SubTypes
            if (filterOptions[key][value]) {
                filterOptions[key][value].forEach(sub => {
                    children.push(`${value}/${sub}`);
                });
            }
        }
        return children;
    }, [filterOptions]);

    const handleCheckboxFilterChange = useCallback((key, value, isSelectAll) => {
        setFilters(prev => {
            const currentFilters = prev[key] || [];
            let newFilters = [...currentFilters];

            if (key === 'Tags' || key === 'Status' || key === 'Visibility') {
                if (newFilters.includes(value)) {
                    newFilters = newFilters.filter(v => v !== value);
                } else {
                    newFilters.push(value);
                }
            } else {
                // Hierarchical Logic
                const children = isSelectAll ? getChildren(key, value) : [];
                
                if (isSelectAll) {
                    // If selecting all, we want to ensure all children are selected.
                    // If all children are already selected, we deselect them.
                    const allChildrenChecked = children.every(c => currentFilters.includes(c));
                    
                    if (allChildrenChecked) {
                        // Uncheck all children
                        newFilters = newFilters.filter(f => !children.includes(f));
                    } else {
                        // Check all children (add missing ones)
                        children.forEach(c => {
                            if (!newFilters.includes(c)) newFilters.push(c);
                        });
                    }
                } else {
                    // Single checkbox toggle
                    if (newFilters.includes(value)) {
                        newFilters = newFilters.filter(v => v !== value);
                    } else {
                        newFilters.push(value);
                    }
                }
            }
            
            return { ...prev, [key]: newFilters };
        });
    }, [getChildren]);

    const resetFilters = useCallback(() => {
        setFilters({ 'Type': [], 'Areas of Operation': [], 'Status': [], 'Tags': [], 'Visibility': [] });
        setFoundedYearRange(yearFilterBounds);
        setSearchTerm('');
    }, [yearFilterBounds]);

    const filteredOrganizations = useMemo(() => {
        // Helper to normalize strings for comparison (trim spaces around slashes)
        const normalize = (str) => str.split('/').map(s => s.trim()).join('/');

        return organizations
            .filter(org => {
                // 1. Search Term
                if (searchTerm) {
                    const searchStr = searchTerm.toLowerCase();
                    const matchesSearch = (
                        (org.name || '').toLowerCase().includes(searchStr) ||
                        (org.description_english || '').toLowerCase().includes(searchStr) ||
                        (org.type || '').toLowerCase().includes(searchStr) ||
                        (org.tags || '').toLowerCase().includes(searchStr)
                    );
                    if (!matchesSearch) return false;
                }

                // 2. Category Filters (AND logic between categories)
                
                // Type (OR logic within)
                if (filters['Type'].length > 0) {
                    const orgTypes = String(org.type || '').split(',').map(t => normalize(t.trim()));
                    // Check if ANY of the selected filters match ANY of the org's types
                    const hasMatch = filters['Type'].some(filterVal => orgTypes.includes(filterVal));
                    if (!hasMatch) return false;
                }

                // Areas (OR logic within)
                if (filters['Areas of Operation'].length > 0) {
                    const orgAreas = String(org.areas_of_operation || '').split(',').map(a => normalize(a.trim()));
                    const hasMatch = filters['Areas of Operation'].some(filterVal => orgAreas.includes(filterVal));
                    if (!hasMatch) return false;
                }

                // Status (OR logic within)
                if (filters['Status'].length > 0) {
                    if (!filters['Status'].includes(org.status)) return false;
                }

                // Visibility (OR logic within)
                if (filters['Visibility'].length > 0) {
                    const orgVis = (org.visibility || '').split('(')[0].trim();
                    if (!filters['Visibility'].includes(orgVis)) return false;
                }

                // Tags (OR logic within)
                if (filters['Tags'].length > 0) {
                    const orgTags = String(org.tags || '').split(',').map(t => t.trim());
                    const hasMatch = filters['Tags'].some(tag => orgTags.includes(tag));
                    if (!hasMatch) return false;
                }

                // Year
                if (org.founded_year) {
                    if (org.founded_year < foundedYearRange[0] || org.founded_year > foundedYearRange[1]) return false;
                }

                return true;
            })
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [organizations, searchTerm, filters, foundedYearRange]);

    return (
        <>
            <Helmet>
                <title>Directory of Organizations for Sudan | Sudan Action Hub</title>
                <meta name="description" content="Explore our directory of organizations working on advocacy, humanitarian aid, and research related to Sudan." />
            </Helmet>
            
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-6">
                            <List className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight mb-6">Organization Directory</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Connect with organizations working on advocacy, humanitarian aid, and research related to Sudan. 
                            Find groups by focus area, location, and type.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
                            <Link to="/contact" className="hover:text-blue-600 transition-colors">
                                Submit an Organization
                            </Link>
                            <span className="text-gray-300">|</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <FilterControls 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    filterOptions={filterOptions} 
                    filters={filters} 
                    handleCheckboxFilterChange={handleCheckboxFilterChange} 
                    foundedYearRange={foundedYearRange} 
                    setFoundedYearRange={setFoundedYearRange} 
                    yearFilterBounds={yearFilterBounds}
                    resetFilters={resetFilters}
                />

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="mb-6 text-gray-500 text-sm font-medium">
                            Showing {filteredOrganizations.length} organizations
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredOrganizations.map(org => (
                                <OrganizationCard key={org.id} org={org} />
                            ))}
                        </div>
                        {filteredOrganizations.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No organizations found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                                <button 
                                    onClick={resetFilters}
                                    className="mt-4 text-blue-600 font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default OrganizationDirectoryPage;