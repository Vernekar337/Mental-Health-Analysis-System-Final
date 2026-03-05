const Alert = require("../models/Alert")

// parent fetch alerts
const getParentAlerts = async (req, res) => {

  try {

    const alerts = await Alert.find({
      parentId: req.user._id
    })
    .sort({ createdAt: -1 })

    res.json({
      success: true,
      alerts
    })

  } catch (err) {

    res.status(500).json({
      success:false,
      message: err.message
    })

  }

}

// parent acknowledge alert
const acknowledgeAlert = async (req,res)=>{

  try{

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { acknowledged:true },
      { new:true }
    )

    res.json({
      success:true,
      alert
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

module.exports = {
  getParentAlerts,
  acknowledgeAlert
}