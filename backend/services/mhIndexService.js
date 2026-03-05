const AssessmentResponse =
require("../models/AssessmentResponse")

const computeCombinedMHIndex =
async(userId)=>{

  const assessments =
  await AssessmentResponse.find({userId})
  .sort({createdAt:-1})

  let phq9 = null
  let gad7 = null
  let dass21 = null

  for(const a of assessments){

    if(a.assessmentType === "PHQ9" && !phq9)
      phq9 = a

    if(a.assessmentType === "GAD7" && !gad7)
      gad7 = a

    if(a.assessmentType === "DASS21" && !dass21)
      dass21 = a

  }

  const normalize =
  (score,max)=>(1-(score/max))*100

  const depressionScore =
  phq9 ? normalize(phq9.totalScore,27) : null

  const anxietyScore =
  gad7 ? normalize(gad7.totalScore,21) : null

  const stressScore =
  dass21 ? normalize(dass21.totalScore,63) : null

  let mhIndex = 0
  let weightSum = 0

  if(depressionScore !== null){
    mhIndex += depressionScore * 0.4
    weightSum += 0.4
  }

  if(anxietyScore !== null){
    mhIndex += anxietyScore * 0.3
    weightSum += 0.3
  }

  if(stressScore !== null){
    mhIndex += stressScore * 0.3
    weightSum += 0.3
  }

  if(weightSum === 0)
    return null

  mhIndex =
  Math.round(mhIndex / weightSum)

  return {

    mhIndex,
    breakdown:{
      depression:depressionScore,
      anxiety:anxietyScore,
      stress:stressScore
    }

  }

}

module.exports = { computeCombinedMHIndex }