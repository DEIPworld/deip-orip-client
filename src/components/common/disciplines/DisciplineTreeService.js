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

export {
    disciplineTree,
    getNodeById,
    getNodesByIdList
}