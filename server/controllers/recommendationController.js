
const recommendationService = require('../services/recommendationService');

const recommend = async (req, res, next) => {
  try {
    const { userProfile, filters, budget } = req.body;
    const results = await recommendationService.recommendUniversities({ userProfile, filters, budget });
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

const track = async (req, res, next) => {
  try {
    const { userId, universityId } = req.body;
    const result = await recommendationService.trackEngagement(userId, universityId);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

module.exports = { recommend, track };
