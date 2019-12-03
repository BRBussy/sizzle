import {Button} from '@material-ui/core';
import {ExerciseStore} from 'bizzle/exercise';
import {Query} from 'bizzle/search/query';
import React from 'react';

const Exercise = () => {

    const handleTest = async () => {
        try {
            await ExerciseStore.FindMany({
                criteria: {},
                query: new Query()
            });
        } catch (e) {
            console.error('error finding exercises', e);
        }
    };

    return (
        <div>
            Exercise
            <Button onClick={handleTest}>
                Test
            </Button>
        </div>
    );
};

export default Exercise;
