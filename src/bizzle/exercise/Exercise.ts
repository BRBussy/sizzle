export enum MuscleGroup {
    BicepsMuscleGroup = 'Biceps',
    PectoralMuscleGroup = 'Pectoral'
}

export default class Exercise {
    public id: string = '';
    public name: string = '';
    public variant: string = '';
    public description: string = '';
    public muscleGroup: MuscleGroup | '' = '';

    constructor(exercise?: Exercise) {
        if (!exercise) {
            return;
        }
        this.id = exercise.id;
        this.name = exercise.name;
        this.variant = exercise.variant;
        this.description = exercise.description;
        this.muscleGroup = exercise.muscleGroup;
    }
}
