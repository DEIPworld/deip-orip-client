import { getDecodedToken, getOwnerWif } from './../utils/auth'
import { signOperation } from './../utils/blockchain';
import reviewsHttp from './http/reviews';

const makeReview = function(researchContentId, isPositive, text) {
    const review = {
        author: getDecodedToken().username,
        research_content_id: researchContentId,
        is_positive: isPositive,
        content: text,
        weight: 10000
    };

    const operation = ["make_review", review];
    return signOperation(operation, getOwnerWif())
        .then((signedTx) => {
            return reviewsHttp.sendMakeReviewOp(signedTx)
        })
}

export {
    makeReview
};
