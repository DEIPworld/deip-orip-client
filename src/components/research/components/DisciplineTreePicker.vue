<template>
    <div>
        <discipline-tree-item
            :discipline="disciplineTree"
            :selectedPath="selectedPath"
            @update="chooseSelectedDiscipline"
        ></discipline-tree-item>
    </div>
</template>

<script>
    export default {
        name: "DisciplineTreePicker",
        methods: {
            chooseSelectedDiscipline(value) {
                this.selectedPath = value;
            }
        },
        data() {
            return {
                selectedPath: '',
                disciplineTree: {
                    isTop: true,
                    children: {
                        'humanities': {
                            path: 'humanities',
                            label: 'Humanities',
                            children: {
                                'language': {
                                    path: 'humanities.language',
                                    label: 'Language',
                                    children: {
                                        russian: {
                                            path: 'humanities.language.russian',
                                            label: 'Russian'
                                        },
                                        belarusian: {
                                            path: 'humanities.language.belarusian',
                                            label: 'Belarusian'
                                        }
                                    }
                                }
                            }
                        },
                        'natrielSciences': {
                            path: 'natrielSciences',
                            label: 'Natiral Sciences',
                            children: {
                                'biology': {
                                    path: 'natrielSciences.biology',
                                    label: 'Biology',
                                    children: {
                                        microbiology: {
                                            path: 'natrielSciences.biology.microbiology',
                                            label: 'Microbiology'
                                        },
                                        zoology: {
                                            path: 'natrielSciences.biology.zoology',
                                            label: 'Zoology'
                                        }
                                    }
                                },
                                'physics': {
                                    path: 'natrielSciences.physics',
                                    label: 'Physics',
                                    children: {
                                        mechanics: {
                                            path: 'natrielSciences.physics.mechanics',
                                            label: 'Mechanics'
                                        },
                                        pptics: {
                                            path: 'natrielSciences.physics.optics',
                                            label: 'Optics'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }
    };
</script>

<style lang="less" scoped>
</style>
