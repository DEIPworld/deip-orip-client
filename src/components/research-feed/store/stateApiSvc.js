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

            const totalVotesPromises = researchResult.map(research => 
                deipRpc.api.getTotalVotesByResearchAsync(research.research_id)
            );

            const reviewsPromises = researchResult.map(research =>
                deipRpc.api.getReviewsByResearchAsync(research.research_id)
            );

            const groupPromises = researchResult.map(research =>
                deipRpc.api.getResearchGroupByIdAsync(research.group_id)
            );

            const disciplineStatsPromises = researchResult.map(research =>
                Promise.all(
                    research.disciplines.map(d => deipRpc.api.getEciAndExpertiseStatsByDisciplineIdAsync(d.id)
                        // when blockchain API will be repaired, catch section should be deleted
                        .catch(() => {
                            return {
                                average_content_eci_in_discipline: 1000,
                                average_expertise_in_discipline: 3357,
                                average_research_eci_in_discipline: 1000,
                                max_research_eci_in_discipline: 8000
                            }
                        })
                    )
                )
            );

            const authorsPromises = researchResult.map(research =>
                getEnrichedProfiles(research.authors)
            );

            const tokenSalesPromises = researchResult.map(research =>
                tokenSaleSvc.getCurrentTokenSaleByResearchId(research.research_id)
            );

            return Promise.all([
                Promise.all(totalVotesPromises),
                Promise.all(reviewsPromises),
                Promise.all(groupPromises),
                Promise.all(disciplineStatsPromises),
                Promise.all(authorsPromises),
                Promise.all(tokenSalesPromises)
            ]);
        })
        .then(([totalVotes, reviews, groups, disciplineStats, authors, tokenSales]) => {
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

                research.disciplines.forEach((discipline, discIndex) => {
                    discipline.stats = disciplineStats[index][discIndex];
                });
            });

            return researchResult;
        });
};

export default {
    loadAllResearches
}