import deipRpc from '@deip/deip-oa-rpc-client';
import researchContentHttp from './../services/http/content';
import * as usersUtils from './../utils/user';

export const ANNOUNCEMENT = 1;
export const FINAL_RESULT = 2;
export const ARTICLE = 3;
export const BOOK = 4;
export const CHAPTER = 5;
export const CODE = 6;
export const CONFERENCE_PAPER = 7;
export const COVER_PAGE = 8;
export const DATA = 9;
export const EXPERIMENT_FINDINGS = 10;
export const METHOD = 11;
export const NEGATIVE_RESULTS = 12;
export const PATENT = 13;
export const POSTER = 14;
export const PREPRINT = 15;
export const PRESENTATION = 16;
export const RAW_DATA = 17;
export const RESEARCH_PROPOSAL = 18;
export const TECHNICAL_REPORT = 19;
export const THESIS = 20;

export const ANNOUNCEMENT_CODE = "announcement";
export const FINAL_RESULT_CODE = "final_result";
export const ARTICLE_CODE = "milestone_article";
export const BOOK_CODE = "milestone_book";
export const CHAPTER_CODE = "milestone_chapter";
export const CODE_CODE = "milestone_code";
export const CONFERENCE_PAPER_CODE = "milestone_conference_paper";
export const COVER_PAGE_CODE = "milestone_cover_page";
export const DATA_CODE = "milestone_data";
export const EXPERIMENT_FINDINGS_CODE = "milestone_experiment_findings";
export const METHOD_CODE = "milestone_method";
export const NEGATIVE_RESULTS_CODE = "milestone_negative_results";
export const PATENT_CODE = "milestone_patent";
export const POSTER_CODE = "milestone_poster";
export const PREPRINT_CODE = "milestone_preprint";
export const PRESENTATION_CODE = "milestone_presentation";
export const RAW_DATA_CODE = "milestone_raw_data";
export const RESEARCH_PROPOSAL_CODE = "milestone_research_proposal";
export const TECHNICAL_REPORT_CODE = "milestone_technical_report";
export const THESIS_CODE = "milestone_thesis";

const contentTypesMap = {};
contentTypesMap[ANNOUNCEMENT] = { id: ANNOUNCEMENT, text: 'Announcement', type: ANNOUNCEMENT_CODE, order: 1 };
contentTypesMap[ARTICLE] = { id: ARTICLE, text: 'Article', type: ARTICLE_CODE, order: 2 };
contentTypesMap[BOOK] = { id: BOOK, text: 'Book', type: BOOK_CODE, order: 3 };
contentTypesMap[CHAPTER] = { id: CHAPTER, text: 'Chapter', type: CHAPTER_CODE, order: 4 };
contentTypesMap[CODE] = { id: CODE, text: 'Code', type: CODE_CODE, order: 5 };
contentTypesMap[CONFERENCE_PAPER] = { id: CONFERENCE_PAPER, text: 'Conference paper', type: CONFERENCE_PAPER_CODE, order: 6 };
contentTypesMap[COVER_PAGE] = { id: COVER_PAGE, text: 'Cover page', type: COVER_PAGE_CODE, order: 7 };
contentTypesMap[DATA] = { id: DATA, text: 'Data', type: DATA_CODE, order: 8 };
contentTypesMap[EXPERIMENT_FINDINGS] = { id: EXPERIMENT_FINDINGS, text: 'Experiment findings', type: EXPERIMENT_FINDINGS_CODE, order: 9 };
contentTypesMap[METHOD] = { id: METHOD, text: 'Method', type: METHOD_CODE, order: 10 };
contentTypesMap[NEGATIVE_RESULTS] = { id: NEGATIVE_RESULTS, text: 'Negative results', type: NEGATIVE_RESULTS_CODE, order: 11 };
contentTypesMap[PATENT] = { id: PATENT, text: 'Patent', type: PATENT_CODE, order: 12 };
contentTypesMap[POSTER] = { id: POSTER, text: 'Poster', type: POSTER_CODE, order: 13 };
contentTypesMap[PREPRINT] = { id: PREPRINT, text: 'Preprint', type: PREPRINT_CODE, order: 14 };
contentTypesMap[PRESENTATION] = { id: PRESENTATION, text: 'Presentation', type: PRESENTATION_CODE, order: 15 };
contentTypesMap[RAW_DATA] = { id: RAW_DATA, text: 'Raw data', type: RAW_DATA_CODE, order: 16 };
contentTypesMap[RESEARCH_PROPOSAL] = { id: RESEARCH_PROPOSAL, text: 'Research proposal', type: RESEARCH_PROPOSAL_CODE, order: 17 };
contentTypesMap[TECHNICAL_REPORT] = { id: TECHNICAL_REPORT, text: 'Technical report', type: TECHNICAL_REPORT_CODE, order: 18 };
contentTypesMap[THESIS] = { id: THESIS, text: 'Thesis', type: THESIS_CODE, order: 19 };
contentTypesMap[FINAL_RESULT] = { id: FINAL_RESULT, text: 'Final Result', type: FINAL_RESULT_CODE, order: 20 };

const contentTypesList = [...Object.values(contentTypesMap)].sort((a, b) => { return a.order - b.order; });
const getResearchContentType = (type) => contentTypesList.find(t => t.type == type);
const getTopResearchesIds = () => [];

const RESEARCH_CONTENT_ECI_SOURCES = {
  1: { type: 'review', text: "Review added" },
  2: { type: 'vote_for_review', text: "Review supported" },
  3: { type: 'init', text: "Material uploaded" }
};

const getResearchContentEciHistoryRecords = (researchContentId, disciplineId) => {

  function mapResearchContentEciHistoryRecord(item) {
    const source = item.op[1];
    const record = {
      researchContentId: source.research_content_id,
      disciplineId: source.discipline_id,
      newAmount: source.new_eci_amount,
      delta: source.delta,
      action: RESEARCH_CONTENT_ECI_SOURCES[source.action].type,
      actionText: RESEARCH_CONTENT_ECI_SOURCES[source.action].text,
      actionObjectId: source.action_object_id,
      timestamp: source.timestamp * 1000
    };
    if (!record.action) {
      throw new Error('Unsupported source found');
    }
    return record;
  };

  return deipRpc.api.getEciHistoryByContentAndDisciplineAsync(researchContentId, disciplineId)
    .then((history) => {
      return history.map(mapResearchContentEciHistoryRecord);
    });
};


const RESEARCH_ECI_SOURCES = {
  1: { type: 'review', text: "Review added" },
  2: { type: 'vote_for_review', text: "Review supported" },
  3: { type: 'init', text: "Material uploaded" }
};

const getResearchEciHistoryRecords = (researchId, disciplineId) => {

  function mapResearchEciHistoryRecord(item) {
    const source = item.op[1];
    const record = {
      researchId: source.research_id,
      disciplineId: source.discipline_id,
      newAmount: source.new_eci_amount,
      delta: source.delta,
      action: RESEARCH_ECI_SOURCES[source.action].type,
      actionText: RESEARCH_ECI_SOURCES[source.action].text,
      actionObjectId: source.action_object_id,
      timestamp: source.timestamp * 1000
    };
    if (!record.action) {
      throw new Error('Unsupported source found');
    }
    return record;
  };

  return deipRpc.api.getEciHistoryByResearchAndDisciplineAsync(researchId, disciplineId)
    .then((history) => {
      return history.map(mapResearchEciHistoryRecord);
    });
};

const getResearchContentOuterReferences = async (researchContent, acc) => {
  let outerReferences = await deipRpc.api.getContentsReferToContentAsync(researchContent.id);

  for (let i = 0; i < outerReferences.length; i++) {
    let item = outerReferences[i];
    let { trx_id, block, timestamp, op } = item;
    let [opName, payload] = op;
    let {
      research_id: researchId,
      research_content_id: researchContentId,
      research_reference_id: referenceResearchId,
      research_content_reference_id: referenceResearchContentId
    } = payload;

    let outerRefResearch = await deipRpc.api.getResearchByIdAsync(researchId);
    let outerRefResearchGroup = await deipRpc.api.getResearchGroupByIdAsync(outerRefResearch.research_group_id);
    let outerRefResearchContent = await deipRpc.api.getResearchContentByIdAsync(researchContentId);

    let hash = outerRefResearchContent.content.split(":")[1];
    let ref = await researchContentHttp.getContentRefByHash(outerRefResearch.id, hash);

    let authorsProfiles = await usersUtils.getEnrichedProfiles(outerRefResearchContent.authors);

    acc.push({
      isOuter: true,
      refType: "out",
      to: referenceResearchContentId,
      researchGroup: outerRefResearchGroup,
      research: outerRefResearch,
      researchContent: { ...outerRefResearchContent, authorsProfiles },
      ref,
      contentType: getResearchContentType(outerRefResearchContent.content_type)
    });
    await getResearchContentOuterReferences(outerRefResearchContent, acc);
  }
}

const getResearchContentInnerReferences = async (researchContent, acc) => {
  let innerReferences = await deipRpc.api.getContentReferencesAsync(researchContent.id);

  for (let i = 0; i < innerReferences.length; i++) {
    let item = innerReferences[i];
    let { trx_id, block, timestamp, op } = item;
    let [opName, payload] = op;
    let {
      research_id: researchId,
      research_content_id: researchContentId,
      research_reference_id: referenceResearchId,
      research_content_reference_id: referenceResearchContentId
    } = payload;

    let innerRefResearch = await deipRpc.api.getResearchByIdAsync(referenceResearchId);
    let innerRefResearchGroup = await deipRpc.api.getResearchGroupByIdAsync(innerRefResearch.research_group_id);
    let innerRefResearchContent = await deipRpc.api.getResearchContentByIdAsync(referenceResearchContentId);

    let hash = innerRefResearchContent.content.split(":")[1];
    let ref = await researchContentHttp.getContentRefByHash(innerRefResearch.id, hash);

    let authorsProfiles = await usersUtils.getEnrichedProfiles(innerRefResearchContent.authors);

    acc.push({
      isInner: true,
      refType: "in",
      to: researchContentId,
      researchGroup: innerRefResearchGroup,
      research: innerRefResearch,
      researchContent: { ...innerRefResearchContent, authorsProfiles },
      ref,
      contentType: getResearchContentType(innerRefResearchContent.content_type)
    });
    await getResearchContentInnerReferences(innerRefResearchContent, acc);
  }
}

const getResearchContentReferencesGraph = async (researchContentId) => {
  let researchContent = await deipRpc.api.getResearchContentByIdAsync(researchContentId);
  let research = await deipRpc.api.getResearchByIdAsync(researchContent.research_id);
  let researchGroup = await deipRpc.api.getResearchGroupByIdAsync(research.research_group_id);

  let hash = researchContent.content.split(":")[1];
  let ref = await researchContentHttp.getContentRefByHash(research.id, hash);

  let authorsProfiles = await usersUtils.getEnrichedProfiles(researchContent.authors);

  const root = {
    isRoot: true,
    refType: "root",
    researchContent: { ...researchContent, authorsProfiles },
    research,
    researchGroup,
    ref,
    contentType: getResearchContentType(researchContent.content_type)
  }

  const outerReferences = [];
  await getResearchContentOuterReferences(researchContent, outerReferences);

  const innerReferences = [];
  await getResearchContentInnerReferences(researchContent, innerReferences);

  const references = [...innerReferences, root, ...outerReferences];
  const nodes = references.reduce((acc, ref) => {
    if (acc.some(r => r.researchContent.id == ref.researchContent.id)) {
      return acc;
    }
    return [...acc, ref];
  }, []);

  const links = [];
  for (let i = 0; i < references.length; i++) {
    let ref = references[i];
    if (ref.isRoot) continue;
    let type = ref.isOuter ? "needs" : "depends";
    let source = nodes.findIndex(node => ref.isOuter ? node.researchContent.id == ref.researchContent.id : node.researchContent.id == ref.to);
    let target = nodes.findIndex(node => ref.isOuter ? node.researchContent.id == ref.to : node.researchContent.id == ref.researchContent.id);
    let link = { source, target, type };
    links.push(link);
  }

  return { nodes, links };
}

export {
  contentTypesMap,
  contentTypesList,
  getResearchContentType,
  getTopResearchesIds,
  getResearchContentEciHistoryRecords,
  getResearchEciHistoryRecords,
  getResearchContentOuterReferences,
  getResearchContentInnerReferences,
  getResearchContentReferencesGraph
}