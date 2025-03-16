const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Set up view engine for HTML files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Home page route
app.get('/', (req, res) => {
    res.render('index.html');
});

// Blog listing page route
app.get('/blog', async (req, res) => {
    try {
        const posts = await fs.readdir(path.join(__dirname, 'posts'));
        const postList = [];
        
        for (const post of posts) {
            if (post.endsWith('.md')) {
                const content = await fs.readFile(path.join(__dirname, 'posts', post), 'utf-8');
                const title = content.split('\n')[0].replace('#', '').trim();
                const date = post.split('-').slice(0, 3).join('-');
                postList.push({ title, date, slug: post.replace('.md', '') });
            }
        }
        
        res.render('blog.html', { posts: postList });
    } catch (error) {
        res.status(500).send('Error loading blog posts');
    }
});

// Individual blog post route
app.get('/blog/:slug', async (req, res) => {
    try {
        const postPath = path.join(__dirname, 'posts', `${req.params.slug}.md`);
        const content = await fs.readFile(postPath, 'utf-8');
        const htmlContent = marked.parse(content);
        res.render('post.html', { content: htmlContent });
    } catch (error) {
        res.status(404).send('Blog post not found');
    }
});

app.listen(port, () => {
    console.log(`Blog running at http://localhost:${port}`);
}); 