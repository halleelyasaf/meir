const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// הגשת קובצי האתר הסטטיים (HTML, CSS, JS, תמונות)
app.use(express.static(__dirname));

// Endpoint מאובטח ליצירת Pull Request
app.post('/api/create-pr', async (req, res) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN missing on server' });
  }

  const { title, tag, date, excerpt, content } = req.body;
  const repoOwner = "halleelyasaf";
  const repoName = "meir";
  const branchName = `article-${Date.now()}`;

  try {
    // 1. קבלת SHA של ענף main
    const refRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const refData = await refRes.json();
    const mainSha = refData.object.sha;

    // 2. יצירת ענף (Branch) חדש
    await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
      method: 'POST',
      headers: { 
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha })
    });

    // 3. קריאת קובץ index.html
    const fileRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html?ref=main`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const fileData = await fileRes.json();
    let htmlContent = Buffer.from(fileData.content, 'base64').toString('utf-8');

    // 4. בניית ה-HTML של המאמר החדש
    const newArticleHTML = `
        <!-- Article -->
        <article class="article-card">
          <div class="article-meta">
            <span class="article-date" data-he="${date}" data-en="${date}">${date}</span>
            <span class="article-tag" data-he="${tag}" data-en="${tag}">${tag}</span>
          </div>
          <h3 class="article-title" data-he="${title}" data-en="${title}">${title}</h3>
          <p class="article-excerpt" data-he="${excerpt}" data-en="${excerpt}">${excerpt}</p>
          <button class="article-toggle btn-text" data-he="קרא עוד ←" data-en="Read more →">קרא עוד ←</button>
          <div class="article-full">
            <p data-he="${content}" data-en="${content}">${content}</p>
            <button class="article-toggle btn-text" data-he="סגור ↑" data-en="Close ↑">סגור ↑</button>
          </div>
        </article>`;

    const targetTag = '<div class="articles-grid">';
    htmlContent = htmlContent.replace(targetTag, `${targetTag}\n${newArticleHTML}`);

    // 5. שמירת השינוי בענף החדש
    await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.html`, {
      method: 'PUT',
      headers: { 
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        message: `Add new article: ${title}`,
        content: Buffer.from(htmlContent, 'utf-8').toString('base64'),
        sha: fileData.sha,
        branch: branchName
      })
    });

    // 6. פתיחת ה-PR
    const prRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
      method: 'POST',
      headers: { 
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        title: `מאמר חדש: ${title}`,
        head: branchName,
        base: 'main',
        body: `נשלח מאמר חדש מהטופס באתר.`
      })
    });

    const prData = await prRes.json();
    return res.json({ success: true, prUrl: prData.html_url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create PR' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
