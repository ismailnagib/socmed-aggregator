const request = require('request')
const User = require('../model/userModel')
const axios = require('axios')
const jwt = require('jsonwebtoken');

class Controller {

    static listStarred(req, res) {
        let options = {
            url: 'https://api.github.com/user/starred',
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            }
        };
        
        request.get(options, (err, response, body) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(200).json({message: 'List of starred repositories acquired', list: JSON.parse(body)})
            }
        });
    }

    static listStarredFilter(req, res) {
        let options = {
            url: 'https://api.github.com/user/starred',
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            }
        };
        
        request.get(options, (err, response, body) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                let key = Object.keys(req.body)[0]
                let value = req.body[key]
                let parsedBody = JSON.parse(body)
                let result = [];
                for (var i = 0; i < parsedBody.length; i++) {
                    if (parsedBody[i][key] === value) {
                        result.push(parsedBody[i])
                    }
                }
                res.status(200).json({message: 'List of starred repositories acquired & filtered', list: result})
            }
        });
    }
    
    static searchByName(req, res) {
        let options = {
            url: `https://api.github.com/search/repositories?q=${req.params.name}+user:${req.params.owner}`,
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            }
        };

        request.get(options, (err, response, body) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(200).json({list: JSON.parse(body)})
            }
        })
    }

    static create(req, res) {
        let options = {
            url: 'https://api.github.com/user/repos',
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                name: req.body.name,
                description: req.body.description
            })
        };

        request.post(options, (err) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(201).json({message: `Repository '${req.body.name}' has been created`})
            }
        })
    }

    static listByUsername(req, res) {
        let options = {
            url: `https://api.github.com/users/${req.params.username}/repos`,
            headers: {
                'User-Agent': 'request',
            }
        };

        request.get(options, (err, response, body) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(500).json({message: `List of repositories by ${req.params.username}`, list: JSON.parse(body)})
            }
        })
    }

    static star(req, res) {
        let options = {
            url: `https://api.github.com/user/starred/${req.params.owner}/${req.params.repo}`,
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            }
        };

        request.put(options, (err) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(200).json({message: `Repository '${req.params.repo}' by ${req.params.owner} has been starred`})
            }
        })
    }

    static unstar(req, res) {
        let options = {
            url: `https://api.github.com/user/starred/${req.params.owner}/${req.params.repo}`,
            headers: {
                'User-Agent': 'request',
                'Authorization': `token ${process.env.ACCESS_TOKEN}`
            }
        };

        request.delete(options, (err) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                res.status(200).json({message: `Repository '${req.params.repo}' by ${req.params.owner} has been unstarred`})
            }
        })
    }

    static checkLogin(req, res) {
        axios({
            method:'get',
            url:`https://graph.facebook.com/me?fields=email,name&access_token=${req.body.accessToken}`,
        })
        .then(result => {
            User.findOne({email: result.data.email}, (err, findResult) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log('AAAAAAAAAAAAAAAAAAAAAA', findResult)
                    if(findResult) {
                        jwt.sign({
                            id: result.data.id,
                            email: result.data.email,
                            name: result.data.name,
                        }, process.env.JWT_KEY, (err, token) => {
                            if (err) {
                                res.status(500).json({message: err.message})
                            } else {
                                res.status(201).json({token: token})
                            }
                        })
                    } else {
                        // console.log('================ ELSE')
                        User.create({
                            email: result.data.email,
                            name: result.data.name
                        }, (err) => {
                            if (err) {
                                res.status(500).json({message: err.message})
                            } else {
                                jwt.sign({
                                    id: result.data.id,
                                    email: result.data.email,
                                    name: result.data.name,
                                }, process.env.JWT_KEY, (err, token) => {
                                    if (err) {
                                        res.status(500).json({message: err.message})
                                    } else {
                                        res.status(201).json({token: token})
                                    }
                                })
                            }
                        })
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    static checkLocalStorage(req, res) {
        jwt.verify(req.body.jwtToken, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.status(500).json({message: err.message})
            } else {
                console.log(decoded)
                User.findOne({email: decoded.email}, (err, findResult) => {
                    if (err) {
                        res.status(500).json({message: err.message})
                    } else {
                        res.status(200).json({isLogin: true})
                    }
                })
            }
        })
    } 
}

module.exports = Controller