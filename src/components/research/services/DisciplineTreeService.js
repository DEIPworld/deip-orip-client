import _ from 'lodash';

const disciplineTree = {
    isTop: true,
    id: 0,
    path: '',
    children: {

        'psychology': {
            path: 'psychology',
            label: 'Psychology',
            id: 2,
            children: {
                'applied_psychology': {
                    path: 'psychology.applied_psychology',
                    label: 'Applied psychology',
                    id: 26
                },
                'biological_psychology': {
                    path: 'psychology.biological_psychology',
                    label: 'Biological psychology',
                    id: 27
                },
                'cognitive_psychology': {
                    path: 'psychology.cognitive_psychology',
                    label: 'Cognitive psychology',
                    id: 28
                }
            }
        },

        'biology': {
            path: 'biology',
            label: 'Biology',
            id: 3,
            children: {
                'anatomy': {
                    path: 'biology.anatomy',
                    label: 'Anatomy',
                    id: 40
                },
                'biochemistry': {
                    path: 'biology.biochemistry',
                    label: 'Biochemistry',
                    id: 41
                },
                'bioinformatics': {
                    path: 'biology.bioinformatics',
                    label: 'Bioinformatics',
                    id: 42
                }
            }
        }

    }
};

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