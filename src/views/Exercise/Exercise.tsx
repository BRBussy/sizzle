import {TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {ExerciseStore} from 'bizzle/exercise';
import {AllMuscleGroups} from 'bizzle/exercise';
import {FindManyResponse as ExerciseFindManyResponse} from 'bizzle/exercise/Store';
import TextSubstringCriterionType from 'bizzle/search/criterion/text/Substring';
import {Query} from 'bizzle/search/query';
import {BPTable} from 'components/Table';
import {SubstringFilter} from 'components/Table/BPTable/filters/text';
import React, {useEffect, useState} from 'react';
import {TextList} from '../../bizzle/search/criterion/text/List';
import useStyles from './style';

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
    const classes = useStyles();
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
    const [generalTextSubstringCriterion, setGeneralTextSubstringCriterion] = useState<TextSubstringCriterionType | null>(null);

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
        setGeneralTextSubstringCriterion(newCriteria);
    };

    useEffect(() => {
        let newCriteria = {};
        if (generalTextSubstringCriterion) {
            newCriteria = {
                ...newCriteria,
                $or: [
                    {name: generalTextSubstringCriterion},
                    {status: generalTextSubstringCriterion}
                ]
            };
        }
        if (selectedMuscleGroups.length) {
            newCriteria = {
                ...newCriteria,
                muscleGroup: TextList(selectedMuscleGroups)
            };
        }
        setCriteria(newCriteria);
    }, [generalTextSubstringCriterion, selectedMuscleGroups]);

    const handleQueryChange = (newQuery: Query) => {
        setQuery(newQuery);
    };

    const handleMuscleGroupFilterChange = (_: any, updatedSelectedMuscleGroups: string[]) => {
        setSelectedMuscleGroups(updatedSelectedMuscleGroups);
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
                    <Autocomplete
                        multiple
                        filterSelectedOptions
                        id={'tags-standard'}
                        options={AllMuscleGroups}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='standard'
                                label='Muscle Group'
                                placeholder={
                                    selectedMuscleGroups.length ? undefined : 'Select Muscle Group'
                                }
                                margin='normal'
                                className={classes.muscleGroupFilterSelect}
                                InputLabelProps={{shrink: true}}
                            />
                        )}
                        onChange={handleMuscleGroupFilterChange}
                    />
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
