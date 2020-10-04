require('dotenv').config();
const auth = require("../models/usermodel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {
    to
} = require('../global_functions');

const SignUp = async (req, res) => {

    try {
        const email = req.body.Email;
        const password = req.body.Password;

        if (!validator.isEmail(email || "")) {
            return res.send("Enter a valid email address");
        }
        if (password === "") {
            return res.send("Password cannot be empty");
        }

        let [notfound, found] = await to(auth.query().findOne("Email", email).first());
        if (found) {
            // console.log(found);
            return res.send("Email already exist");
        }

        // const salt = await bcrypt.genSalt(); the salt can be automatically generated.
        const hashedpassword = await bcrypt.hash(password, 10)
        // console.log(salt)    
        // console.log(hashedpassword)

        const signup = await auth.query().insert({
            Email: email,
            Password: hashedpassword
        })

        res.json({
            Success : "true",
            signup
        })

    } catch (err) {
        res.send(err)
    }

}


//Login User 
const Login = async (req, res) => {
    try {
        let email = req.body.Email;
        let password = req.body.Password;

        if (!validator.isEmail(email || "")) {
            return res.send("Enter a valid email address");
        }
        if (password === "") {
            return res.send("Password cannot be empty");
        }
        // CHECK FOR NOT FOUND
        let [not_found, found] = await to(auth.query().findOne("Email", email).throwIfNotFound());
        console.log(found);
        if (not_found) {
            return res.send("Email Not Found")
        }

        if (await bcrypt.compare(password, found.Password)) {
            const accessToken = jwt.sign({
                                     email: found.Email
                                     }, process.env.ACCESS_TOKEN_SECRET)
            // console.log(accessToken);
            if (accessToken) {
                res.setHeader("Authorization", accessToken);
                res.setHeader("access-control-expose-headers", "authorization");
                res.json({
                    User: "Loggedin",
                    accessToken: accessToken
                });
            }

        } else {
            res.send("Wrong password");
        }

    } catch (err) {
        console.log(err)
    }
}
const AllUser = async (req, res) => {

    const [err, all] = await to(auth.query());
    if (err) return res.status(400).send(err)

    res.json({
        Succes: "true",
        Data: all
    })
}

module.exports = {
    SignUp,
    Login,
    AllUser
}