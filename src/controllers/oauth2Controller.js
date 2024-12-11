const passport = require('passport');

// Redireciona o usuário para o provedor OAuth2
exports.redirectToAuth = (req, res, next) => {
    passport.authenticate('oauth2')(req, res, next);
};

// Processa o callback do OAuth2 após a autenticação
exports.handleCallback = (req, res, next) => {
    passport.authenticate('oauth2', (err, user, info) => {
        if (err) {
            res.send(500, { error: 'Erro na autenticação' });
            return next();
        }
        if (!user) {
            res.send(400, { error: 'Falha na autenticação ou no retorno do perfil' });
            return next();
        }

        // Redireciona para a página de perfil
        res.redirect('/profile.html', next);
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    if (req.logout) {
        // Passport fornece a função logout para remover a sessão do usuário
        req.logout(err => {
            if (err) {
                res.send(500, { error: 'Erro ao realizar logout.' });
                return next();
            }
            // Redireciona para a página inicial ou de login
            res.redirect('/');
            next();
        });
    } else {
        // Caso `req.logout` não esteja disponível
        res.send(500, { error: 'Logout não suportado no servidor.' });
        next();
    }
};


