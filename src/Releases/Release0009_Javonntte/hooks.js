import { useContext, useEffect } from 'react';
import {BuildingsContext} from './BuildingsContext';

const useBuildings = () => {
    const [state, setState] = useContext(BuildingsContext);

    return {
        buildings: state.buildings.loaded && state.buildings;
    }
};

export default useBuildings;