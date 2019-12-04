import {Query} from 'bizzle/search/query';

interface BPTableProps {
    columns: Column[];
    data: Array<{ [key: string]: any }>;
    initialQuery?: Query;
    height?: number;
    title: string;
    filters: React.ReactNode[];
    onQueryChange: (newQuery: Query) => void;
    totalNoRecords: number;
    loading?: boolean;
}

interface Column {
    field?: string;
    label: string;
    minWidth?: number;
    align?: 'right';
    accessor?: (data: any) => string | number;
    addStyle?: { [key: string]: any };
}
