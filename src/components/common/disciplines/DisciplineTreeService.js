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
        program.area = researchAreas[0];
        program.subArea = researchAreas[0].subAreas[0];
        return;
    }

    var subArea = area.subAreas.find(sa => sa.disciplines.some(d => program.disciplines.includes(d)));
    if (!subArea) {
        program.area = researchAreas[0];
        program.subArea = researchAreas[0].subAreas[0];
        return;
    }

    program.area = area;
    program.subArea = subArea;
};

const getTopLevelNodes = () => {
    return Object.values(disciplineTree.children);
}

export {
    disciplineTree,
    getNodeById,
    getNodesByIdList,
    mapAreaToProgram,
    getTopLevelNodes
}