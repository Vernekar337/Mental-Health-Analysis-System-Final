const AnalysisResult =
require("../models/AnalysisResult")

const Insight =
require("../models/Insight")

const aiQueue =
require("../queues/aiQueue")



const getInsights =
async (req, res) => {

  try {

    const insight =
      await Insight.findOne({
        userId: req.user._id
      })
      .sort({ createdAt: -1 })

    if (!insight) {

      return res.json({
        success: true,
        status: "not_found",
        insight: null
      })

    }

    res.json({
      success: true,
      status: insight.status,
      insight: insight.content
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}


// const getInsights =
// async (req, res) => {

//   try {

//     const existing =
//       await Insight.findOne({
//         userId: req.user._id
//       }).sort({ createdAt: -1 })

//     if (existing) {

//       return res.json({
//         success: true,
//         status: existing.status,
//         insight: existing.content
//       })

//     }

//     const latestAnalysis =
//       await AnalysisResult.findOne({
//         userId: req.user._id
//       }).sort({ createdAt: -1 })

//     const insight =
//       await Insight.create({

//         userId: req.user._id,

//         status: "pending"
//       })

//     await aiQueue.add(
//       "insight-generation",
//       {
//         type: "insight",

//         payload: {
//           insightId: insight._id,

//           mhIndex: latestAnalysis?.mhIndex,
//           severity: latestAnalysis?.severity,
//           trend: "stable"
//         }
//       }
//     )

//     res.json({
//       success: true,
//       status: "pending"
//     })

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message
//     })

//   }

// }

module.exports = { getInsights }