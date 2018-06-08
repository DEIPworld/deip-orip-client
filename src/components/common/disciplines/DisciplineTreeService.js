import _ from 'lodash';
import disciplineTree from './DisciplineTree';

const getNodeById = (node, id) => {
    if (node.id === id) {
        return node;
    }
    if (!node.children) {
        return;
    }

    const children = _.values(node.children);

    for (let i = 0; i < children.length; i++) {
        let res = getNodeById(children[i], id);

        if (res) {
            return res;
        }
    }
}

export {
    disciplineTree,
    getNodeById
}