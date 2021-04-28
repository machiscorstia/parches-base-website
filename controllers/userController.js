const User = require('../database/schemas/user')

// functions

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

// Renders

exports.renderRegisterPage = (req, res) => {
    res.render('user/register', { title: 'Registro' });
};

exports.renderLoginPage = (req, res) => {
    res.render('user/login', { title: 'Ingresar' });
};

exports.renderProfile = (req, res) => {
    const user = req.user
    res.render('user/profile', user);
};

// Post routes

exports.postNewUser = async (req, res) => {
    const values = req.body

    const existUsername = await this.findUserByUsername(values.username)
    const existEmail = await this.findUserByEmail(values.email)

    if(existUsername) req.flash('messageFailure', 'El nombre que introduciste ya esta registrado')
    
    else if(existEmail) req.flash('messageFailure', 'El email que introduciste ya esta registrado')
    
    else {
        const newUser = await this.createNewUser(req.body)
        await newUser.save()
        req.flash('messageSuccess', 'Te has registrado correctamente')
        res.redirect('/')
    }

    res.redirect('/user/register')
};

// Database

exports.createNewUser = async (values) => { return await new User(values); };

exports.findById = async (id) => { return await User.findById(id) }

exports.findUserByEmail = async (email) => { return await User.findOne({ 'email': email}) }

exports.findUserByUsername = async (username) => { return await User.findOne({ 'username': username}) }