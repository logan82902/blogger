/* GET blog list page. */
module.exports.blogList = function(req, res) {
    res.render('blogList', { title: 'Blog List' });
};    

/* GET blog add page. */
module.exports.blogAdd = function(req, res) {
    res.render('blogAdd', { title: 'Blog Add' });
};    