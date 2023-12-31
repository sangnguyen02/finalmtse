const { getGoogleOauthToken, getGoogleUser }= require('./googleServer')
const Admin = require("../models/adminSchema")
const Student = require("../models/studentSchema")
const Teacher = require("../models/teacherSchema")
exports.googleOauthHandler = async (req, res, next) => {
    try {
        const code = req.query.code;
  
        if (!code) {
          return next(new appError('Authorization code not provided!', 401));
        }
      
        // Use the code to get the id and access tokens
        const { id_token, access_token } = await getGoogleOauthToken({ code });
      
        // Use the token to get the User
        const { id, email, verified_email, name, given_name, family_name } =
          await getGoogleUser({
            id_token,
            access_token
          });
          console.log(email)
          let admin = await Admin.findOne({ email });
          let student = await Student.findOne({ email });
          let teacher = await Teacher.findOne({ email });
          if(admin) {
            const cookieOption = {
              expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
              ),
              httpOnly: false
            };
        
            res.cookie('user', admin, cookieOption);
            res.redirect("http://localhost:3000/")
          } else if (student) {
            const cookieOption = {
              expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
              ),
              httpOnly: false
            };
            res.cookie('user', student, cookieOption);
            res.redirect("http://localhost:3000/");
          } else if (teacher) {
            const cookieOption = {
              expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
              ),
              httpOnly: false
            };
            res.cookie('user', teacher, cookieOption);
            res.redirect("http://localhost:3000/");
          } else {
            console.error("User not found");
            // Redirect to an error page or handle it as needed
            res.redirect("http://localhost:3000/error");
          }
    }
    catch (err) {
        console.error(err)
    }
   
  };