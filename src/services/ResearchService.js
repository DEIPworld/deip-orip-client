import deipRpc from '@deip/deip-oa-rpc-client';
import * as usersUtils from './../utils/user';
import researchContentHttp from './../services/http/content';

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

const contentTypesMap = {};
contentTypesMap[ANNOUNCEMENT] = { id: ANNOUNCEMENT, text: 'Announcement', type: 'announcement', order: 1 };
contentTypesMap[ARTICLE] = { id: ARTICLE, text: 'Article', type: 'milestone_article', order: 2 };
contentTypesMap[BOOK] = { id: BOOK, text: 'Book', type: 'milestone_book', order: 3 };
contentTypesMap[CHAPTER] = { id: CHAPTER, text: 'Chapter', type: 'milestone_chapter', order: 4 };
contentTypesMap[CODE] = { id: CODE, text: 'Code', type: 'milestone_code', order: 5 };
contentTypesMap[CONFERENCE_PAPER] = { id: CONFERENCE_PAPER, text: 'Conference paper', type: 'milestone_conference_paper', order: 6 };
contentTypesMap[COVER_PAGE] = { id: COVER_PAGE, text: 'Cover page', type: 'milestone_cover_page', order: 7 };
contentTypesMap[DATA] = { id: DATA, text: 'Data', type: 'milestone_data', order: 8 };
contentTypesMap[EXPERIMENT_FINDINGS] = { id: EXPERIMENT_FINDINGS, text: 'Experiment findings', type: 'milestone_experiment_findings', order: 9 };
contentTypesMap[METHOD] = { id: METHOD, text: 'Method', type: 'milestone_method', order: 10 };
contentTypesMap[NEGATIVE_RESULTS] = { id: NEGATIVE_RESULTS, text: 'Negative results', type: 'milestone_negative_results', order: 11 };
contentTypesMap[PATENT] = { id: PATENT, text: 'Patent', type: 'milestone_patent', order: 12 };
contentTypesMap[POSTER] = { id: POSTER, text: 'Poster', type: 'milestone_poster', order: 13 };
contentTypesMap[PREPRINT] = { id: PREPRINT, text: 'Preprint', type: 'milestone_preprint', order: 14 };
contentTypesMap[PRESENTATION] = { id: PRESENTATION, text: 'Presentation', type: 'milestone_presentation', order: 15 };
contentTypesMap[RAW_DATA] = { id: RAW_DATA, text: 'Raw data', type: 'milestone_raw_data', order: 16 };
contentTypesMap[RESEARCH_PROPOSAL] = { id: RESEARCH_PROPOSAL, text: 'Research proposal', type: 'milestone_research_proposal', order: 17 };
contentTypesMap[TECHNICAL_REPORT] = { id: TECHNICAL_REPORT, text: 'Technical report', type: 'milestone_technical_report', order: 18 };
contentTypesMap[THESIS] = { id: THESIS, text: 'Thesis', type: 'milestone_thesis', order: 19 };
contentTypesMap[FINAL_RESULT] = { id: FINAL_RESULT, text: 'Final Result', type: 'final_result', order: 20 };

const contentTypesList = [...Object.values(contentTypesMap)].sort((a, b) => {
    return a.order - b.order;
});

const getContentType = (type) => contentTypesList.find(t => t.type == type);
const getTopResearchesIds = () => [21, 14, 24, 7, 10, 5, 0, 6, 26, 28, 15, 23, 9, 25, 20, 12];

const loadResearchContentOuterReferences = async (researchContent, acc) => {
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
            contentType: getContentType(outerRefResearchContent.content_type)
        });
        await loadResearchContentOuterReferences(outerRefResearchContent, acc);
    }
}

const loadResearchContentInnerReferences = async (researchContent, acc) => {
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
            contentType: getContentType(innerRefResearchContent.content_type)
        });
        await loadResearchContentInnerReferences(innerRefResearchContent, acc);
    }
}

const loadResearchContentReferencesGraph = async (researchContentId) => {
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
        contentType: getContentType(researchContent.content_type)
    }

    const outerReferences = [];
    await loadResearchContentOuterReferences(researchContent, outerReferences);

    const innerReferences = [];
    await loadResearchContentInnerReferences(researchContent, innerReferences);

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
    getContentType,
    getTopResearchesIds,
    loadResearchContentOuterReferences,
    loadResearchContentInnerReferences,
    loadResearchContentReferencesGraph
}
