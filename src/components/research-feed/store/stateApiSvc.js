import _ from 'lodash';
import deipRpc from '@deip/deip-rpc-client';
import { getEnrichedProfiles } from './../../../utils/user';
import tokenSaleSvc from './../../../services/TokenSaleService'

const loadAllResearches = () => {
    const disciplineId = 0;
    let researchResult = [];

    return deipRpc.api.getAllResearchesListingAsync(0, disciplineId)
        .then(list => {
            researchResult = list;

            const researchPromises = researchResult.map(research => 
                deipRpc.api.getTotalVotesByResearchAsync(research.research_id)
            );

            const reviewsPromises = researchResult.map(research =>
                deipRpc.api.getReviewsByResearchAsync(research.research_id)
            );

            const groupPromises = researchResult.map(research =>
                deipRpc.api.getResearchGroupByIdAsync(research.group_id)
            );

            const authorsPromises = researchResult.map(research =>
                getEnrichedProfiles(research.authors)
            );

            const tokenSalesPromises = researchResult.map(research =>
                tokenSaleSvc.getCurrentTokenSaleByResearchId(research.research_id)
            );

            return Promise.all([
                Promise.all(researchPromises),
                Promise.all(reviewsPromises),
                Promise.all(groupPromises),
                Promise.all(authorsPromises),
                Promise.all(tokenSalesPromises)
            ]);
        })
        .then(([totalVotes, reviews, groups, authors, tokenSales]) => {
            let totalVotesMap = _.chain(totalVotes)
                .flatten()
                .groupBy('research_id')
                .value();

            researchResult.forEach((research, index) => {
                research.isCollapsed = true;

                research.totalVotes = totalVotesMap[research.research_id] ? totalVotesMap[research.research_id] : [];
                research.reviews = reviews[index];
                research.group = groups[index];
                research.enrichedAuthors = authors[index];
                research.tokenSale = tokenSales[index];
            });

            return researchResult;
        });
};

export default {
    loadAllResearches
}