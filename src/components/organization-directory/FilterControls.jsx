import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { getTagStyle } from '@/utils/tagUtils';

const FilterSection = ({ title, children }) => (
    <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wider">{title}</h4>
        {children}
    </div>
);

const FilterCheckbox = ({ id, label, checked, onCheckedChange, className }) => (
    <div className={cn("flex items-center space-x-2", className)}>
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label 
            htmlFor={id} 
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer py-1"
        >
            {label}
        </Label>
    </div>
);

const FilterControls = ({ 
    searchTerm, 
    setSearchTerm, 
    filterOptions, 
    filters, 
    handleCheckboxFilterChange, 
    foundedYearRange, 
    setFoundedYearRange, 
    yearFilterBounds,
    resetFilters
}) => {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [tagsOpen, setTagsOpen] = useState(false);

    const activeFilterCount = Object.values(filters).flat().length;

    const renderTypeFilters = () => {
        const types = filterOptions['Type'] || {};
        return (
            <div className="w-full space-y-1">
                {Object.entries(types).map(([mainType, subTypes]) => {
                    const isMainChecked = filters['Type']?.some(f => f.startsWith(mainType));
                    
                    // If no subcategories, render simple checkbox row
                    if (!subTypes || subTypes.length === 0) {
                        return (
                            <div key={mainType} className="flex items-center justify-start gap-2 py-2 px-1 hover:bg-gray-50 rounded-md transition-colors">
                                <Checkbox 
                                    id={`type-main-${mainType}`}
                                    checked={isMainChecked}
                                    onCheckedChange={() => handleCheckboxFilterChange('Type', mainType, false)}
                                />
                                <Label htmlFor={`type-main-${mainType}`} className="text-sm font-medium cursor-pointer flex-grow">
                                    {mainType}
                                </Label>
                            </div>
                        );
                    }

                    // If subcategories exist, render Accordion
                    return (
                        <Accordion key={mainType} type="single" collapsible className="w-full border-none">
                            <AccordionItem value={mainType} className="border-b-0">
                                <div className="flex items-center py-1 hover:bg-gray-50 rounded-md transition-colors pr-2">
                                    <div className="flex items-center pl-1" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox 
                                            checked={isMainChecked}
                                            onCheckedChange={() => handleCheckboxFilterChange('Type', mainType, true)}
                                            className="mr-2"
                                        />
                                    </div>
                                    <AccordionTrigger className="hover:no-underline py-1 text-sm font-medium flex-1 justify-between">
                                        <span>{mainType}</span>
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent className="pl-7 pb-2 pt-1">
                                    <div className="grid grid-cols-1 gap-2 border-l-2 border-gray-100 pl-3">
                                        {subTypes.map(subType => {
                                            const fullValue = `${mainType}/${subType}`;
                                            return (
                                                <FilterCheckbox
                                                    key={fullValue}
                                                    id={`type-${fullValue}`}
                                                    label={subType}
                                                    checked={filters['Type']?.includes(fullValue)}
                                                    onCheckedChange={() => handleCheckboxFilterChange('Type', fullValue, false)}
                                                />
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                })}
            </div>
        );
    };

    const renderAreaFilters = () => {
        const areas = filterOptions['Areas of Operation'] || {};
        return (
            <div className="w-full space-y-1">
                {Object.entries(areas).map(([mainArea, level2s]) => {
                    const isMainChecked = filters['Areas of Operation']?.some(f => f.startsWith(mainArea));
                    const hasSub = Object.keys(level2s).length > 0;

                    if (!hasSub) {
                         return (
                            <div key={mainArea} className="flex items-center justify-start gap-2 py-2 px-1 hover:bg-gray-50 rounded-md transition-colors">
                                <Checkbox 
                                    id={`area-main-${mainArea}`}
                                    checked={isMainChecked}
                                    onCheckedChange={() => handleCheckboxFilterChange('Areas of Operation', mainArea, false)}
                                />
                                <Label htmlFor={`area-main-${mainArea}`} className="text-sm font-medium cursor-pointer flex-grow">
                                    {mainArea}
                                </Label>
                            </div>
                        );
                    }

                    return (
                        <Accordion key={mainArea} type="single" collapsible className="w-full border-none">
                            <AccordionItem value={mainArea} className="border-b-0">
                                <div className="flex items-center py-1 hover:bg-gray-50 rounded-md transition-colors pr-2">
                                    <div className="flex items-center pl-1" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox 
                                            checked={isMainChecked}
                                            onCheckedChange={() => handleCheckboxFilterChange('Areas of Operation', mainArea, true)}
                                            className="mr-2"
                                        />
                                    </div>
                                    <AccordionTrigger className="hover:no-underline py-1 text-sm font-medium flex-1 justify-between">
                                        <span>{mainArea}</span>
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent className="pl-7 pb-2 pt-1">
                                    <div className="space-y-2 border-l-2 border-gray-100 pl-3">
                                        {Object.entries(level2s).map(([level2, level3s]) => {
                                            const level2Value = `${mainArea}/${level2}`;
                                            return (
                                                <div key={level2Value} className="space-y-1">
                                                    <div className="flex items-center justify-start gap-2">
                                                        <FilterCheckbox
                                                            id={`area-${level2Value}`}
                                                            label={level2}
                                                            checked={filters['Areas of Operation']?.some(f => f.startsWith(level2Value))}
                                                            onCheckedChange={() => handleCheckboxFilterChange('Areas of Operation', level2Value, true)}
                                                            className="font-medium"
                                                        />
                                                    </div>
                                                    {level3s.length > 0 && (
                                                        <div className="pl-6 grid grid-cols-1 gap-1.5 mt-1">
                                                            {level3s.map(level3 => {
                                                                const fullValue = `${level2Value} (${level3})`;
                                                                return (
                                                                    <FilterCheckbox
                                                                        key={fullValue}
                                                                        id={`area-${fullValue}`}
                                                                        label={level3}
                                                                        checked={filters['Areas of Operation']?.includes(fullValue)}
                                                                        onCheckedChange={() => handleCheckboxFilterChange('Areas of Operation', fullValue, false)}
                                                                        className="text-gray-600"
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Top Bar: Search & Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search organizations by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full h-12 text-lg shadow-sm"
                    />
                </div>
                
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <CollapsibleTrigger asChild>
                        <Button 
                            size="lg" 
                            className={cn(
                                "h-12 px-6 w-full md:w-auto justify-between md:justify-center shadow-sm transition-all",
                                filtersOpen 
                                    ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent" 
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-blue-600"
                            )}
                        >
                            <div className="flex items-center">
                                <Filter className="mr-2 h-5 w-5" />
                                Filter Categories
                                {activeFilterCount > 0 && (
                                    <Badge variant="secondary" className="ml-2 bg-white/20 text-current hover:bg-white/30 border-0">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </div>
                            {filtersOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </Button>
                    </CollapsibleTrigger>
                </Collapsible>
            </div>

            {/* Expandable Filter Panel */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent className="space-y-0">
                    <div className="bg-white rounded-xl border shadow-sm p-6 mt-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Filter className="h-5 w-5 mr-2 text-blue-600" />
                                Active Filters
                            </h3>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={resetFilters} 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                disabled={activeFilterCount === 0}
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                Reset All
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Column 1: Type */}
                            <FilterSection title="Organization Type">
                                {renderTypeFilters()}
                            </FilterSection>

                            {/* Column 2: Status & Visibility */}
                            <div className="space-y-8">
                                <FilterSection title="Status">
                                    <div className="space-y-2">
                                        {filterOptions['Status']?.map(status => (
                                            <FilterCheckbox
                                                key={status}
                                                id={`status-${status}`}
                                                label={status}
                                                checked={filters['Status']?.includes(status)}
                                                onCheckedChange={() => handleCheckboxFilterChange('Status', status, false)}
                                            />
                                        ))}
                                    </div>
                                </FilterSection>

                                <FilterSection title="Visibility">
                                    <div className="space-y-2">
                                        {filterOptions['Visibility']?.map(vis => (
                                            <FilterCheckbox
                                                key={vis}
                                                id={`vis-${vis}`}
                                                label={vis}
                                                checked={filters['Visibility']?.includes(vis)}
                                                onCheckedChange={() => handleCheckboxFilterChange('Visibility', vis, false)}
                                            />
                                        ))}
                                    </div>
                                </FilterSection>
                            </div>

                            {/* Column 3 & 4: Areas of Operation (Spanning 2 cols on large screens) */}
                            <div className="lg:col-span-2">
                                <FilterSection title="Areas of Operation">
                                    {renderAreaFilters()}
                                </FilterSection>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Founding Year Slider */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <Label className="text-base font-semibold text-gray-900">Founding Year</Label>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {foundedYearRange[0]} - {foundedYearRange[1]}
                    </span>
                </div>
                <Slider 
                    min={yearFilterBounds[0]} 
                    max={yearFilterBounds[1]} 
                    step={1} 
                    value={foundedYearRange} 
                    onValueChange={setFoundedYearRange} 
                    className="w-full py-4" 
                />
            </div>

            {/* Tags Filter - Collapsible Dropdown */}
            {filterOptions.Tags && filterOptions.Tags.length > 0 && (
                <Collapsible
                    open={tagsOpen}
                    onOpenChange={setTagsOpen}
                    className="bg-white rounded-xl border shadow-sm overflow-hidden"
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-gray-50 transition-colors">
                        <Label className="text-base font-semibold text-gray-900 cursor-pointer">Filter by Tags</Label>
                        {tagsOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.Tags.map(tag => {
                                    const isSelected = filters.Tags?.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => handleCheckboxFilterChange('Tags', tag)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                                                getTagStyle(tag, isSelected)
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
};

export default FilterControls;