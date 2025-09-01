const jwt=require('jsonwebtoken')

const authMid=(req,res,next)=>{
    const head=req.headers.authorization
    if(!head||!head.startsWith('Bearer ')){
        return res.status(401).json({msg:"Authorization token missing",success:false})
    }
    const token=head.split(" ")[1]
     try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({msg:"Invalid or expired token",success:false});
  }
}

module.exports={authMid}