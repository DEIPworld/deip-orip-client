import _ from 'lodash';
import disciplineTree from './DisciplineTree';

const getNodeByIdRecursive = (node, id) => {
    if (node.id === id) {
        return node;
    }
    
    if (!node.children) {
        return;
    }

    const children = _.values(node.children);

    for (let i = 0; i < children.length; i++) {
        let res = getNodeByIdRecursive(children[i], id);

        if (res) {
            return res;
        }
    }
}

const getNodeById = id => {
    let node = getNodeByIdRecursive(disciplineTree, id);

    return {
        id: node.id,
        label: node.label,
        path: node.path
    }
};

const getNodesByIdList = idList => {
    return idList.map(id => getNodeById(id));
};

const mapAreaToProgram = (program, researchAreas)  => {
    // to do: prepare a better algo for the demo, must be revised in the future
    program.disciplines = [program.target_discipline];

    var area = researchAreas.find(a => { return a.subAreas.some(sa => sa.disciplines.some(d => program.disciplines.includes(d))); });
    if (!area) {
        area = researchAreas[0];
    }

    var subArea = area.subAreas.find(sa => sa.disciplines.some(d => program.disciplines.includes(d)));
    if (!subArea) {
        area = researchAreas[0];
        subArea = researchAreas[0].subAreas[0];
    }

    program.area = area;
    program.subArea = subArea;
}

export {
    disciplineTree,
    getNodeById,
    getNodesByIdList,
    mapAreaToProgram
}