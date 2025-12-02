import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Database } from 'lucide-react';

const DirectoryDataPage = () => {
    const [filterOptions, setFilterOptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('organizations').select('Type, "Areas of Operation", Status, Visibility, Tags');
                if (error) throw error;

                if (!data || data.length === 0) {
                    setFilterOptions({});
                    return;
                }

                const options = { 'Type': {}, 'Areas of Operation': {}, 'Status': {}, 'Tags': new Set(), 'Visibility': {} };
                const groupedFields = ['Type', 'Areas of Operation', 'Status', 'Visibility'];

                data.forEach(item => {
                    groupedFields.forEach(key => {
                        const value = item[key];
                        if (!value) return;

                        String(value).split(',').map(s => s.trim()).filter(Boolean).forEach(v => {
                            let main, sub;
                             if (key === 'Visibility') {
                                main = v.split('(')[0].trim();
                                sub = null;
                            } else if (key === 'Type') {
                                const parts = v.split('/');
                                main = parts[0].trim();
                                sub = parts.length > 1 ? parts.slice(1).join('/').trim() : null;
                            } else { // Areas of Operation, Status
                                const match = v.match(/(.*?)\s*\((.*?)\)/);
                                main = match ? match[1].trim() : v.trim();
                                sub = match ? match[2].trim() : null;
                            }

                            if (!options[key][main]) options[key][main] = new Set();
                            if (sub) options[key][main].add(sub);
                        });
                    });

                    if (item['Tags']) String(item['Tags']).split(',').map(s => s.trim()).filter(Boolean).forEach(v => options['Tags'].add(v));
                });
                
                const sortedOptions = { 'Tags': Array.from(options['Tags']).sort() };
                 groupedFields.forEach(key => {
                    sortedOptions[key] = {};
                    Object.keys(options[key]).sort().forEach(mainKey => {
                        sortedOptions[key][mainKey] = Array.from(options[key][mainKey]).sort();
                    });
                });

                setFilterOptions(sortedOptions);

            } catch (err) {
                setError(err.message);
                toast({ variant: "destructive", title: "Error fetching data", description: err.message });
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessData();
    }, [toast]);

    const renderCategory = (title, data) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {Array.isArray(data) ? (
                     <ul className="list-disc pl-5 space-y-1">
                        {data.map(item => <li key={item}>{item}</li>)}
                    </ul>
                ) : (
                    <ul className="space-y-2">
                        {Object.entries(data).map(([main, subs]) => (
                            <li key={main}>
                                <span className="font-semibold">{main}</span>
                                {subs.length > 0 && (
                                    <ul className="list-disc pl-6 mt-1 text-sm text-gray-700">
                                        {subs.map(sub => <li key={sub}>{sub}</li>)}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Helmet>
                <title>Organization Directory Data | Sudan Action Hub</title>
                <meta name="description" content="A comprehensive list of all unique values, categories, and tags used in the Sudan Organization Directory for filtering and data analysis." />
                <meta name="keywords" content="Sudan directory data, organization categories, filterable values, directory tags, areas of operation" />
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://sudan-action-hub.com/organization-directory/data" />
            </Helmet>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/organization-directory" className="inline-flex items-center text-blue-600 hover:underline mb-4">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Directory
                    </Link>
                    <div className="flex items-center gap-4">
                        <Database className="h-10 w-10 text-blue-600"/>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Organization Directory Data</h1>
                            <p className="mt-1 text-lg text-gray-600">
                                A complete list of all unique filterable values from the directory.
                            </p>
                        </div>
                    </div>
                </div>

                {loading && <p>Loading data...</p>}
                {error && <p className="text-red-500">Could not load data: {error}</p>}
                
                {filterOptions && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {renderCategory("Type", filterOptions.Type)}
                        {renderCategory("Areas of Operation", filterOptions['Areas of Operation'])}
                        {renderCategory("Status", filterOptions.Status)}
                        {renderCategory("Visibility", filterOptions.Visibility)}
                        {renderCategory("Tags", filterOptions.Tags)}
                    </div>
                )}
            </div>
        </>
    );
};

export default DirectoryDataPage;