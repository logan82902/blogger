/* GET blog list page. */
module.exports.blogList = function(req, res) {
    res.render('blogList', { title: 'Blog List',
        blogs:[            
            { title: 'Blog Entry 1', text: 'First blog text...' },
            { title: 'Blog Entry 2', text: 'Second blog text...' },
            { title: 'Blog Entry 3', text: 'Third blog text...' }
        ]
    });
};

/* GET blog add page. */
module.exports.blogAdd = function(req, res) {
    res.render('blogAdd', { title: 'Blog Add' });
};    

/* GET blog edit page */
module.exports.blogEdit = function(req, res){
    res.render('blogEdit', { title: 'Blog Edit' });
};

/* GET blog delete page */
module.exports.blogDelete = function(req, res){
    res.render('blogDelete', { title: 'Blog Delete' });
};

