import {ExerciseStore} from 'bizzle/exercise';
import {AllMuscleGroups} from 'bizzle/exercise';
import {FindManyResponse as ExerciseFindManyResponse} from 'bizzle/exercise/Store';
import TextSubstringCriterionType from 'bizzle/search/criterion/text/Substring';
import {Query} from 'bizzle/search/query';
import {BPTable} from 'components/Table';
import {SubstringFilter} from 'components/Table/BPTable/filters/text';
import React, {useEffect, useState} from 'react';

let fetchDataTimeout: any;

const Exercise = () => {
    const [query, setQuery] = useState(new Query({
        limit: 10,
        offset: 0,
        sorting: []
    }));
    const [criteria, setCriteria] = useState({});
    const [loading, setLoading] = useState(false);
    const [exerciseFindManyResponse, setExerciseFindManyResponse] = useState<ExerciseFindManyResponse>({
        records: [],
        total: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                setExerciseFindManyResponse(await ExerciseStore.FindMany({
                    criteria,
                    query
                }));
            } catch (e) {
                console.error('error finding exercises', e);
            }
            setLoading(false);
        };
        clearTimeout(fetchDataTimeout);
        fetchDataTimeout = setTimeout(fetchData, 400);
    }, [query, criteria]);

    const handleCriteriaChange = (newCriteria: TextSubstringCriterionType | null) => {
        if (newCriteria === null) {
            setCriteria({});
        } else {
            setCriteria({
                $or: [
                    { name: newCriteria },
                    { status: newCriteria }
                ]
            });
        }
    };

    const handleQueryChange = (newQuery: Query) => {
        setQuery(newQuery);
    };

    return (
        <div>
            <BPTable
                loading={loading}
                title={'Client List'}
                onQueryChange={handleQueryChange}
                initialQuery={query}
                totalNoRecords={exerciseFindManyResponse.total}
                filters={[
                    <SubstringFilter
                        onChange={handleCriteriaChange}
                    />,
                    <div>filterX</div>
                ]}
                columns={[
                    {
                        field: 'name',
                        label: 'Name'
                    },
                    {
                        field: 'variant',
                        label: 'Variant'
                    },
                    {
                        field: 'description',
                        label: 'Description'
                    },
                    {
                        field: 'muscleGroup',
                        label: 'Muscle Group'
                    }
                ]}
                data={exerciseFindManyResponse.records}
            />
        </div>
    );
};

export default Exercise;
