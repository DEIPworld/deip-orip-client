import { project } from './basicWords';

export default {
  title: `Edit ${project()}`,
  titleBlock: {
    title: 'Tilte:',
    titleField: {
      err: `${project(true)} with the same name already exists`
    }
  },
  descriptionBlock: {
    title: 'Description:'
  },
  visibilityBlock: {
    title: 'Visibility',
    private: `Private ${project()}`,
    public: `Public ${project()}`
  },
  updateProject: `Update ${project(true)}`,
  updateInfo: 'Update Info',
  updateImg: 'Update image',
  back: `Back to ${project()}`,
  invalidLink: 'Invalid http(s) link',
  categoryBlock: {
    title: 'Domain:',
    categoryField: 'Domain'
  },
  videoBlock: {
    title: 'Video Presentation:',
    linkField: 'Link to a video presentation'
  },
  attributesBlock: {
    title: `${project()} attributes`
  },
  partnersBlock: {
    title: 'Partners'
  },
  milestoneBlock: {
    title: 'Active Milestone:',
    milestoneField: 'Milestone'
  },
  roadmapBlock: {
    title: 'Roadmap:'
  },
  backgroundBlock: {
    title: 'Background:'
  },
  successProp: 'Information has been updated successfully',
  errProp: 'An error occurred during proposal sending',
  successInfo: `${project(true)} has been updated successfully`,
  errInfo: 'An error occurred during info update',
  successImg: 'Background image has been updated successfully ! Refresh the page please',
  errImg: 'Sorry, an error occurred while uploading background image, please try again later',
  shouldHaveGoal: `${project(true)} should have the primary Goal`,
  requiredGoal: 'Step Goal is required',
  shouldHaveBudget: `${project(true)} should have the estimated budget`,
  requiredBudget: 'Step budget is required',
  shouldHavePurpose: `${project(true)} should have the budget purpose`,
  requiredPurpose: 'Step purpose is required',
  specifiedDeadline: 'Goal deadline should be specified',
  notPastdeadline: 'Goal deadline can not be in the Past'
};
