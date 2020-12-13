import { project } from './basicWords';

export default {
  domainBlock: {
    title: 'Domain',
    select: 'Select domain',
    next: 'Next'
  },
  teamBlock: {
    title: 'Team',
    select: 'Select team',
    add: '+ Add new team',
    back: 'Back',
    next: 'Next'
  },
  metaBlock: {
    title: 'Title',
    add: 'Add title and description',
    titleField: {
      label: 'Title',
      err: `${project(true)} with the same name already exists`
    },
    descriptionField: 'Description',
    linkField: 'Link to a video presentation',
    back: 'Back',
    next: 'Next'
  },
  roadmapBlock: {
    title: 'Roadmap',
    roadmap: 'Roadmap',
    roadmapText: `Let’s create a roadmap for your ${project()}. Well-presented and detailed roadmap attracts more investors to help you to get the funding`,
    back: 'Back',
    next: 'Next step'
  },
  settingsBlock: {
    title: 'Settings',
    settings: `${project(true)} settings`,
    visibility: 'Visibility',
    private: `Private ${project()}`,
    public: `Public ${project()}`,
    partners: 'Partners',
    back: 'Back',
    next: `Create ${project()}`
  },
  sharesBlock: {
    title: 'Reward shares'
  },
  success: `${project(true)} "{title}" has been created successfully`,
  err: `An error occurred while creating ${project()}, please try again later`
};
